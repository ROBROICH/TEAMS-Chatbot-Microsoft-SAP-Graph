// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory, CardFactory, AttachmentLayoutTypes } = require('botbuilder');
const {
    OAuthPrompt,
    AttachmentPrompt,
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { channels } = require('botbuilder-dialogs/lib/choices/channel');
const { UserProfile } = require('../userProfile');
const { OAuthHelpers } = require('../oAuthHelpers');
const { SimpleSAPGraphClient } = require('../simple-SAP-graph-client');
const { SimpleAdaptiveCardFactory } = require('../simple-adaptive-card-factory');


const OAUTH_PROMPT = 'OAuthPrompt';

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const CONFIRM_PROMPT_OAUTH = 'CONFIRM_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';


class UserProfileDialog extends ComponentDialog {
    constructor(userState) {
        super('userProfileDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(
            new OAuthPrompt(OAUTH_PROMPT, {
                connectionName: process.env.connectionName,
                text: 'Please Sign In',
                title: 'Sign In',
                timeout: 300000
            }));

        this.addDialog(new TextPrompt(TEXT_PROMPT));

        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT_OAUTH));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.promptStep.bind(this),
            this.loginStep.bind(this),
            this.displayTokenStep1.bind(this),
            this.displayTokenStep2.bind(this),
            this.commandStep.bind(this),
            this.processStep.bind(this),
            this.sapGraphStep.bind(this),
        ]));

        this.initialDialogId = WATERFALL_DIALOG;

        //this.testCard = require('../resources/simpleAdaptiveCard.json');

    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }


    async promptStep(stepContext) {
        //var simpleSAPGraphClient = new SimpleSAPGraphClient();
        //simpleSAPGraphClient.getSAPGraphData();
        await stepContext.context.sendActivity('Welcome to the Microsoft Graph & SAP Graph Chatbot Demo.');
        return await stepContext.beginDialog(OAUTH_PROMPT);
    }

    async loginStep(stepContext) {
        // Get the token from the previous step. Note that we could also have gotten the
        // token directly from the prompt itself. There is an example of this in the next method.
        const tokenResponse = stepContext.result;
        if (tokenResponse) {
            await stepContext.context.sendActivity('You are now logged in.');
            return await stepContext.prompt(CONFIRM_PROMPT_OAUTH, 'Would you like to view your token? Please prompt \'YES\' for this demo');
        }
        await stepContext.context.sendActivity('Login was not successful please try again.');
        return await stepContext.endDialog();
    }



    async displayTokenStep1(stepContext) {
        await stepContext.context.sendActivity('Thank you.');

        const result = stepContext.result;
        if (result) {
            // Call the prompt again because we need the token. The reasons for this are:
            // 1. If the user is already logged in we do not need to store the token locally in the bot and worry
            // about refreshing it. We can always just call the prompt again to get the token.
            // 2. We never know how long it will take a user to respond. By the time the
            // user responds the token may have expired. The user would then be prompted to login again.
            //
            // There is no reason to store the token locally in the bot because we can always just call
            // the OAuth prompt to get the token or get a new token if needed.
            return await stepContext.beginDialog(OAUTH_PROMPT);
        }
        return await stepContext.endDialog();
    }


    async displayTokenStep2(stepContext) {
        const tokenResponse = stepContext.result;
        if (tokenResponse && tokenResponse.token) {
            await stepContext.context.sendActivity(`Here is your token ${tokenResponse.token}`);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Please type \'inbox\' to display your Outlook inbox via the Microsoft Graph API or \'me\' for your profile' });
        }
        return await stepContext.endDialog();
    }


    async actionStep(step) {
        // Get the token from the previous step. Note that we could also have gotten the
        // token directly from the prompt itself. There is an example of this in the next method.
        const tokenResponse = step.result;
        if (tokenResponse.token) {
            await step.context.sendActivity('You are now logged in.');
            return await step.prompt(TEXT_PROMPT, { prompt: 'Please type \'inbox\' for work items in your inbox and \'me\' for your profile)' });
        }
        await step.context.sendActivity('Login was not successful please try again.');
        return await step.endDialog();
    }



    async commandStep(step) {
        step.values.command = step.result;

        // Call the prompt again because we need the token. The reasons for this are:
        // 1. If the user is already logged in we do not need to store the token locally in the bot and worry
        // about refreshing it. We can always just call the prompt again to get the token.
        // 2. We never know how long it will take a user to respond. By the time the
        // user responds the token may have expired. The user would then be prompted to login again.
        //
        // There is no reason to store the token locally in the bot because we can always just call
        // the OAuth prompt to get the token or get a new token if needed.
        return await step.beginDialog(OAUTH_PROMPT);
    }

    async processStep(step) {
        if (step.result) {
            // We do not need to store the token in the bot. When we need the token we can
            // send another prompt. If the token is valid the user will not need to log back in.
            // The token will be available in the Result property of the task.
            const tokenResponse = step.result;

            // If we have the token use the user is authenticated so we may use it to make API calls.
            if (tokenResponse && tokenResponse.token) {
                const parts = (step.values.command || '').toLowerCase().split(' ');

                const command = parts[0];

                switch (command) {
                case 'me':
                    await OAuthHelpers.listMe(step.context, tokenResponse);
                    break;
                case 'inbox':
                    await OAuthHelpers.listRecentMail(step.context, tokenResponse);
                    break;
                default:
                    await step.context.sendActivity(`Your token is ${ tokenResponse.token }`);
                }
                return await step.prompt(TEXT_PROMPT, { prompt: 'Please type the customer name and lastname for displaying the open sales orders' });
            }
        } else {
            await step.context.sendActivity('We couldn\'t log you in. Please try again later.');
        }

        return await step.endDialog();
    }


    async sapGraphStep(step) {
        
        const parts = (step.result || '').split(' ');

        var simpleSAPGraphClient = new SimpleSAPGraphClient();

        const customerAPIServicePath = '/beta/Customers?$filter=lastName%20eq%20\'%queryParameter%\'';
        
        //For demo purposes just search via lastname. 
        const customers = await simpleSAPGraphClient.getSAPGraphData(customerAPIServicePath, parts[1]);

        //ToDo: Search by unique user mail address. For demo select the first search result 
        var customer = customers.value[0]
        
        //Store the customer Id to search for sales orders via ID
        var customerId = customers.value[0].id;

        

        await step.context.sendActivity(`The id for customer : ${ customer.firstName } ${ customer.lastName } in SAP master data is ${ customer.id}. \n\n Now searching for this customers sales order in SAP \n\n`);

        const salesOrderAPIServicePath = '/beta/Customers/%queryParameter%/SalesOrders';
        
        const salesOrders = await simpleSAPGraphClient.getSAPGraphData(salesOrderAPIServicePath, customerId);

        let numberOfSalesOrders = salesOrders.value.length;

        const reply = { attachments: [], attachmentLayout: AttachmentLayoutTypes.List };
            for (let cnt = 0; cnt < numberOfSalesOrders; cnt++) {
                const salesOrder = salesOrders.value[cnt];
                const card = CardFactory.heroCard(
                    'Salesorder Id ' + salesOrder.id + ' Customer Id ' + salesOrder.customerID,
                    //ToDo: Iterate of the sales order items. 
                    'Item: ' + salesOrder.items[0].productDescription + ' Requested delivery date: ' + salesOrder.requestedDeliveryDate,
                    [{type: 'Image', alt: 'SAP Logo', url: 'https://media3.giphy.com/media/l2RsUTEu5aIzV6DYWA/source.gif', height: '5px',  width:'5px'}],
                    ['Send update via email'],
                    { subtitle: `Distribution Channel : ${ salesOrder.distributionChannel.name } Division: ${ salesOrder.division.name }` }
                );
                reply.attachments.push(card);
            }
        await step.context.sendActivity(reply);    


        return await step.endDialog();
    }


}

module.exports.UserProfileDialog = UserProfileDialog;
