// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { CardFactory, AttachmentLayoutTypes } = require('botbuilder');

const {
  OAuthPrompt,
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
} = require('botbuilder-dialogs');

const { OAuthHelpers } = require('../helpers/oAuthHelpers');
const { SimpleSAPGraphClient } = require('../simple-SAP-graph-client');
const { SimpleSAPAPIHubClient } = require('../simple-SAP-API-Hub-client');
const { SAPGraphHelper } = require('../helpers/SAP-graph-helper');
const {
  AdaptiveCardsHelper,
} = require('../helpers/adaptiveCards/AdaptiveCardsHelper');

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
        timeout: 300000,
      })
    );

    this.addDialog(new TextPrompt(TEXT_PROMPT));

    // Start the user interaction / waterfall dialog
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.promptStep.bind(this),
        this.loginStep.bind(this),
        this.commandStep.bind(this),
        this.processStep.bind(this),
        this.sapGraphStep.bind(this),
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
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

  // Here we start
  async promptStep(stepContext) {
    await stepContext.context.sendActivity(
      'Welcome to the Microsoft Graph & SAP Graph Chatbot Demo.'
    );
    return await stepContext.beginDialog(OAUTH_PROMPT);
  }

  async loginStep(stepContext) {
    // Get the token from the previous step. Note that we could also have gotten the
    // token directly from the prompt itself. There is an example of this in the next method.
    const tokenResponse = stepContext.result;
    if (tokenResponse && tokenResponse.token) {
      await stepContext.context.sendActivity('You are now logged in.');
      return await stepContext.prompt(TEXT_PROMPT, {
        prompt:
          "Please type 'inbox' to display your Outlook inbox via the Microsoft Graph API or 'me' for your profile",
      });
    }
    await stepContext.context.sendActivity(
      'Login was not successful please try again.'
    );
    return await stepContext.endDialog();
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
            await step.context.sendActivity(
              `Your token is ${tokenResponse.token}`
            );
        }
        return await step.prompt(TEXT_PROMPT, {
          prompt:
            'Please type the customer name and lastname for displaying the open sales orders',
        });
      }
    } else {
      await step.context.sendActivity(
        "We couldn't log you in. Please try again later."
      );
    }

    return await step.endDialog();
  }

  // Get the data from the SAP Graph
  async sapGraphStep(step) {
    try {
      const parts = (step.result || '').split(' ');

      //let simpleSAPGraphClient = new SimpleSAPGraphClient();
      let simpleSAPClient = new SimpleSAPAPIHubClient();

      // For demo purposes just search via lastname.
      //e.g. Domestic US Customer 1
      const customers = await simpleSAPClient.getCustomersByLastName(
        step.result
      );

      // ToDo: Search by unique user mail address. For demo select the first search result

      // Store the customer Id to search for sales orders via ID
      let customerId = customers[0].businessPartner;

      let customerName = customers[0].businessPartnerName;

      await step.context.sendActivity(
        `The id for customer : ${customerName} in SAP master data is ${customerId}. \n\n Now searching for this customers sales order in SAP \n\n`
      );

      const salesOrders = await simpleSAPClient.getSalesOrderForCustomerId(
        customerId
      );

      // ToDo: error handling if no salesOrders were found
      const numberOfSalesOrders = salesOrders.length;

      // Create a hero card and loop over graph result set
      const reply = {
        attachments: [],
        attachmentLayout: AttachmentLayoutTypes.List,
      };
      for (let cnt = 0; cnt < numberOfSalesOrders; cnt++) {
        const salesOrder = salesOrders[cnt];

        // get Sales Order Adaptive Card JSON Template and adjust it according to the items we have in Sales Order
        salesOrderAdaptiveCard.body[2].columns = AdaptiveCardsHelper.getItemsTable(
          salesOrder.items
        );

        // decide which color to use depending of the Sales Order status
        const statusColor = SAPGraphHelper.getColorByStatusCode(
          salesOrder.overallSdProcessStatus
        );

        const template = new AdaptiveCardTemplating.Template(
          salesOrderAdaptiveCard
        );

        const card = template.expand({
          $root: {
            salesOrderID: salesOrder.salesOrder,
            customerID: salesOrder.soldToParty,
            orderDate: salesOrder.salesOrderDate,
            netAmount: salesOrder.totalNetAmount,
            currency: salesOrder.transactionCurrency,
            statusText: salesOrder.overallSDProcessStatus,
            statusColor: statusColor,
          },
        });

        const cardInBotFormat = CardFactory.adaptiveCard(card);

        reply.attachments.push(cardInBotFormat);
      }
      await step.context.sendActivity(reply);
    } catch (error) {
      console.log(error);
    }

    return await step.endDialog();
  }
}

module.exports.UserProfileDialog = UserProfileDialog;
