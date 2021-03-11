// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { CardFactory, AttachmentLayoutTypes } = require('botbuilder');

const {
    OAuthPrompt,
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { OAuthHelpers } = require('../helpers/oAuthHelpers');
const { SimpleSAPGraphClient } = require('../simple-SAP-graph-client');
const { SAPGraphHelper } = require('../helpers/SAP-graph-helper');
const { AdaptiveCardsHelper } = require('../helpers/adaptiveCards/AdaptiveCardsHelper');

const salesOrderAdaptiveCard = require('../helpers/adaptiveCards/salesOrderAdaptiveCard.json');
const AdaptiveCardTemplating = require('adaptivecards-templating');

const OAUTH_PROMPT = 'OAuthPrompt';

const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';

class UserProfileDialog extends ComponentDialog {
    // The user interaction flow is defined in the constructor
    constructor(userState) {
        super('userProfileDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        // Prompt for OAUTH
        this.addDialog(
            new OAuthPrompt(OAUTH_PROMPT, {
                connectionName: process.env.connectionName,
                text: 'Please Sign In',
                title: 'Sign In',
                timeout: 300000
            }));

        this.addDialog(new TextPrompt(TEXT_PROMPT));

        // Start the user interaction / waterfall dialog
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.promptStep.bind(this),
            this.loginStep.bind(this),
            this.commandStep.bind(this),
            this.processStep.bind(this),
            this.sapGraphStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    };

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

    // Here we start
    async promptStep(stepContext) {
        await stepContext.context.sendActivity('Welcome to the Microsoft Graph & SAP Graph Chatbot Demo.');
        return await stepContext.beginDialog(OAUTH_PROMPT);
    }

    async loginStep(stepContext) {
        // Get the token from the previous step. Note that we could also have gotten the
        // token directly from the prompt itself. There is an example of this in the next method.
        const tokenResponse = stepContext.result;
        if (tokenResponse && tokenResponse.token) {
            await stepContext.context.sendActivity('You are now logged in.');
            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Please type \'inbox\' to display your Outlook inbox via the Microsoft Graph API or \'me\' for your profile' });
        }
        await stepContext.context.sendActivity('Login was not successful please try again.');
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

                // This case is relevant for the hands-on lab. Search in the inbox via MS Graph
                case 'inbox':
                    await OAuthHelpers.listRecentMail(step.context, tokenResponse);
                    break;
                default:
                    await step.context.sendActivity(`Your token is ${ tokenResponse.token }`);
                }
                return await step.prompt(TEXT_PROMPT, { prompt: 'Please type the order number for displaying the sales order details' });
            }
        } else {
            await step.context.sendActivity('We couldn\'t log you in. Please try again later.');
        }

        return await step.endDialog();
    }

    // Get the data from the SAP Graph
    async sapGraphStep(step) {
        const parts = (step.result || '').split(' ');

        var simpleSAPGraphClient = new SimpleSAPGraphClient();

        const salesOrders = await simpleSAPGraphClient.getOrderByOrderNumber(parts[0]);
        const customer = await simpleSAPGraphClient.getCustomerBySalesOrder(salesOrders[0]); // for demo purposes only first sales order is considered

        // TODO: error handling if no salesOrders were found
        const numberOfSalesOrders = salesOrders.length;

        // Create a hero card and loop over graph result set
        const reply = { attachments: [], attachmentLayout: AttachmentLayoutTypes.List };
        for (let cnt = 0; cnt < numberOfSalesOrders; cnt++) {
            const salesOrder = salesOrders[cnt];

            // get Sales Order Adaptive Card JSON Template and adjust it according to the items we have in Sales Order
            salesOrderAdaptiveCard.body[2].columns = AdaptiveCardsHelper.getItemsTable(salesOrder.items);

            // decide which color to use depending of the Sales Order status
            const statusColor = SAPGraphHelper.getColorByStatusCode(salesOrder.processingStatus.code);

            const template = new AdaptiveCardTemplating.Template(salesOrderAdaptiveCard);
            console.log("Customer phone Numbers: ");
            console.log(customer.addressData.phoneNumbers);
            const card = template.expand({
                $root: {
                    salesOrderID: salesOrder.displayId,
                    customerID: customer.displayId, // salesOrder.customer.id, // TODO: lesen vom BP und anzeigen der displayId
                    distributionChannel: salesOrder.distributionChannel.name,
                    division: salesOrder.division.name,
                    orderDate: salesOrder.orderDate,
                    netAmount: salesOrder.netAmount,
                    currency: salesOrder.currency.code,
                    statusText: salesOrder.processingStatus.name,
                    statusColor: statusColor,
                    contactName: customer.organization.nameDetails.formattedOrgNameLine1, // TODO: find a customer <> Organization
                    contactPhoneNumber: customer.addressData[0].phoneNumbers[0].number
                    // TODO: telefonnummer
                }
            });

            const cardInBotFormat = CardFactory.adaptiveCard(card);

            reply.attachments.push(cardInBotFormat);
        }
        await step.context.sendActivity(reply);

        return await step.endDialog();
    }
}

module.exports.UserProfileDialog = UserProfileDialog;
