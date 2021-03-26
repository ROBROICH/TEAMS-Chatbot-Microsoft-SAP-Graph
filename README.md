# Hands-On Lab: Combining the Microsoft-Graph and SAP-Graph in a Microsoft Teams and Azure Bot scenario. 

# Introduction and motivation
This hands-on lab facilitates Microsoft Teams as the preferred hub for teamwork and collaboration tool for today’s frontline and remote workers. Additionally Azure Bots, especially in the combination with Teams, are an impressive solution to efficiently guide internal employees and external clients through complex business processes spanning over multiple IT-backends like SAP and Office 365. 

This hands-on lab will hence demonstrate the implementation of an Azure Bot for Microsoft Teams that provides integrated information from Microsoft 365 and SAP by leveraging the particular Graph API of each vendor. 

Both Graph solutions enable developers to efficiently integrate business applications using a single API, correspondingly from SAP or Microsoft, that transparently delivers information from various backend applications. 

Further resources about the Microsoft- and SAP-Graph: 
* [SAP Graph BETA](https://beta.graph.sap/)

![SAPGRAPH](./resources/SAP_GRAPH.png)
* [Microsoft Graph](https://developer.microsoft.com/en-us/graph/graph-explorer)

![MICROSOFTGRAPH](./resources/MICROSOFT_GRAPH.png)

When implementing the Microsoft Graph demonstrating the Azure Active Directory (AD) integration with functionality like SSO and API permissions is intended as an important aspect of this exercise. 

Currently Azure AD integration with the SAP Graph (BETA) is not possible, a public Bearer token was used. 

Furthermore, this hands-on tutorial will describe the complete setup of the development environment from scratch.

A summary of the scenario as PDF can be found here: [Summary](./resources/2020730_GRAPH_CHATBOT.pdf)

This setup and corresponding documentation are intended for enabling developers to extend this example with their own ideas or customer scenarios. 
# Business scenario and context
This lab is developed based on a basic theoretical business scenario with the following assumptions and processes:
* The call center agent or frontline employee uses Microsoft Teams as preferred user-interface
* The customer is requesting an update about an order via email 
* The call center agent processes the customer inquiry utilizing a chatbot in MS Teams
* The first step of the business process is to the search the agents Outlook inbox for customer inquiries via the MS Graph API
* After the sales order of a customer is identified, the chatbot then enables the agent to search with the sales order id within SAP for sales order details using the SAP Graph API
* The chatbot returns the sales order details and with a click of a button the details the agent can call the customer out of MS Teams
* Optional / Next step: The agent now could send an email using the MS Graph API to update the customer about the sales orders status. 

Summarized: 

The purpose of this lab is to demonstrate the simple integration of Microsoft and SAP business- and process-data utilizing modern and open APIs. 

![BusinessScenario](./resources/ScenarioOverview.png)

# Setup of the development environment 
In order to run the lab and even more important to further extend this example, an essential aspect and exercise of this lab is to setup the development environment. Programming-environment and -language is Node.JS, therefore Java-Script knowledge is recommended. 
The first action or hands on exercise is to install the following components in the development environment: 
* [Visual Studio Code](https://code.visualstudio.com/download)
* [Microsoft Graph](https://developer.microsoft.com/en-us/graph/graph-explorer) (no installation necessary)
* [Git Client](https://git-scm.com/download)
* [NGROK Client](https://ngrok.com/download) + Set the Windows PATH Environment Variable 
* [Teams App Studio](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/app-studio-overview)
* [Python](https://www.microsoft.com/en-us/p/python-38/9mssztt1n39l?activetab=pivot:overviewtab) - needed for node-gyp rebuild

The example was built on top of the Bot Builder sample code-library and for development purposes, especially in regard to Azure AD configuration for demo-users, a development Microsoft 365 tenant is recommended. 
In addition, the local Bot-Framework emulator was helpful to test bot functionality without having to deploy to Teams. 

Optional: 
* [Bot Framework Emulator](https://github.com/microsoft/BotFramework-Emulator) - needed for local testing
* [Bot Builder samples](https://github.com/microsoft/BotBuilder-Samples)
* [Microsoft 365 developer sandbox](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
The recommendation is as well to gain knowledge about Bot Builder by understanding the Bot Builder sample exercises. 
The source-code of this lab is implemented based on the Bot Builder sample [24. MS Graph authentication](https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/24.bot-authentication-msgraph)
and [46. Teams authentication](https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/46.teams-auth)

# Local application setup 
The deployment of the chatbot will be implemented using a local version and an external tunnel to forward the communication to the Azure chatbot channel. 
After the time-consuming installation prework the manual deployment can be done with a few lines of Windows Power Shell. 
The specific next steps to implement are: 
* Open Visual Studio Code
* Open two PowerShell terminals in Visual Studio Code 
* The commands for the first terminal to start the application: 
```
git clone https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph.git
cd .\TEAMS-Chatbot-Microsoft-SAP-Graph\
npm install 
npm start
```
* The command for the second terminal to start the ngrok forwarding: 
```
ngrok http -host-header=rewrite 3978
```
After the successful implementation of the steps the result should look as following: 
![VisualStudioCode](./resources/VisualStudioCodeConfig.png)

Please note the ngrok HTTPS forwarding URL(https:/xxxx.ngrok.io) as marked on the screenshot above.  

# Azure AD App registration 
After successful installation of the development environment and local deployment of the application, the next step is to configure the App registration for authentication and corresponding Microsoft Graph API permissions. 
The necessary steps are already described in this tutorial: 
[Add authentication to your Teams bot](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication)

Please finish this tutorial until [Prepare the bot sample code](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=node-js%2Cdotnet-sample#prepare-the-bot-sample-code) and **skip section** [Create the service plan](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=dotnet%2Cdotnet-sample#create-the-service-plan).

In addition go back to the app registration in Azure Active Directory and modify the API permissions: 
![IPGraphAPIPermission](./resources/IP_GRAPH_API_PERMISSIONS.png)
In case of further customer scenarios or development concepts, these permissions for the MS Graph API access might have to be adjusted. One example to further extend this scenario would be implementing the [Microsoft Search API](https://docs.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-beta). 
  As written in the tutorial the `*.env` configuration file must be updated with the App ID and customer secret from the bot channel registration. In addition, the `connectionName` of the identity provider must be set. To do so copy the `.env.template` file to tg the `.env` file and put in the corresponding values
```
MicrosoftAppId=App Id from Bot channel 
MicrosoftAppPassword=Customer password/client secret from Bot channel 
connectionName=Identity provider connection
...
SAPAuthBearerToken=eyJhbGciOi...
```
> HINT: In case the `SAPAuthBearerToken` does not work anymore you can use the [public SAP Graph API bearer token for testing purposes](https://explore.graph.sap/docs/beta/api-sandbox).

The `.env` file will be ignored by git due to the settings in the .gitignore file to avoid accedentially pushing your credentials to your code repository. 

# Install and test the bot with the emulator and Teams
To test the bot with the local bot emulator please implement this section of the tutorial: 
*  [Test the bot using the Emulator](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=node-js%2Cdotnet-sample#test-the-bot-using-the-emulator).
![BOTEMULATOR](./resources/ChatBotEmulator.png)

*  [Testing the bot locally in Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=node-js%2Cdotnet-sample#testing-the-bot-locally-in-teams)

After finishing the two section above the TeamsAppManifest/manifest.json will be updated with the recent App Ids and uploaded to Teams:
  ```
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.5/MicrosoftTeams.schema.json",
  "manifestVersion": "1.5",
  "version": "2.0.0",
  "id": " App Id from Bot channel ",
  "packageName": "com.microsoft.teams.samples",
  "developer": {
    "name": "Microsoft",
    "websiteUrl": "https://example.azurewebsites.net",
    "privacyUrl": "https://example.azurewebsites.net/privacy",
    "termsOfUseUrl": "https://example.azurewebsites.net/termsofuse"
  },
  "icons": {
    "color": "icon-color.png",
    "outline": "icon-outline.png"
  },
  "name": {
    "short": "MS and SAP Graph Chatbot",
    "full": "Microsoft and SAP Graph Chatbot"
  },
  "description": {
    "short": "Chatbot to demonstrate Microsoft and SAP Graph integration",
    "full": "Chatbot to demonstrate Microsoft and SAP Graph integration"
  },
  "accentColor": "#FFFFFF",
  "bots": [
    {
      "botId": " App Id from Bot channel ",
      "scopes": [
        "personal",
        "groupchat",
        "team"
      ],
      "supportsFiles": false,
      "isNotificationOnly": false
    }
  ],
  "permissions": [
    "identity",
    "messageTeamMembers"
  ],
  "validDomains": [
    "token.botframework.com",
    "*.ngrok.io",
    "graph.microsoft.com"
  ],
  "webApplicationInfo": {
    "id": "",
    "resource": "https://graph.microsoft.com/"
  }
}

```
After uploading the manifest.json file, the bot configuration in the Teams App Studio will look as following: 
![TEAMSAPPSTUDIO](./resources/TEAMS_APP_STUDIO.png)

# Demo-flow and API consumption
After successful local testing in Teams the demo-flow will be as described below. 
## Azure AD logon and granting API permission for MS Graph 
When the user logons for the first time the API permission for MS Graph must be granted by the user: 
![DEMOFLOWAD1](./resources/DemoFlowAD1.png)
![DEMOFLOWAD2](./resources/DemoFlowAD2.png)
After successful logon and API permission authorization the Outlook Inbox of the logged on user will be displayed. In the demo the agent will look for customer e-mails asking for order statuses. 
![DEMOFLOWMSGRAPH](./resources/DemoFlowMSGraphQuery.png)
The call-center agent will now pick a sales order id and search for details via the SAP Graph. Technically the search query will invoke two SAP Graph APIs to:
*  Search for SAP sales order based on the sales order ID queried previously. 
*  Search for the SAP customer details based on sales order details.  
![DEMOFLOWSAPGRAPH](./resources/DemoFlowSAPGraphQuery.png)
For displaying the results of the Graph queries basic [Adaptive Cards](https://docs.microsoft.com/en-us/adaptive-cards/) were implemented. 

Clicking on the call button of the sales order details card, the agent can call the customer directly out of MS Teams.

Here the demo ends for now and as further enhancement different actions could be triggered by the call-center agent. 

One example could be sending an email with an update about the order status.

## Pitfall
Up to now the bot was not pushed to Azure but the request were redirected via the NGROK to your local environment. Each time you restart NGROK the endpoint exposed via NGROK will change. Consequently, you must update the value in your Bot Channel Registration Settings i.e. in the Messaging endpoint defined there. 

# Deploy your bot to azure [optional] 
To publish your bot in Azure you need to
1. Create an Azure App Service and set the application settings based on your current `.env` file

For convenience you can use the provided ARM template to deploy and configure the app service. Just use the following Azure CLI command below:

```
az deployment group create --resource-group <name of your resource group> --template-file .\deploymentTemplates\template-appservice.json
```


2. Deploy your sourcecode to the app service via the Visual Studio Code extension
3. Change the messaging endpoint in your `Bot Channels Registration` to your newly created app service endpoint

Now your chatbot should work, even if the service is not running locally.

# Summary and next steps 
As stated at the beginning of this document, the intention of this lab is to enable developers in extending and modifying this starter implementation. 
In addition, the motivation is to demonstrate how business processes based on Microsoft and SAP enterprise applications can be easily integrated within an intuitive user-interfaces like Microsoft Teams. 

The following next steps are possible ideas for enhancements: 
* Implement Microsoft Graph Search API to search beyond the Outlook Inbox
* Connect your on-premise SAP system using OData services or [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview) with the [On-premises Data Gateway](https://docs.microsoft.com/en-us/data-integration/gateway/service-gateway-onprem)
* Enhance the dialogs and make it more stable and usefull
* Use the [LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/what-is-luis) service to add intelligence to your bot
