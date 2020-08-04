# Hands-On Lab: Combining the Microsoft- Graph and SAP-Graph APIs in a Microsoft Teams bot scenario. 

# Introduction and motivation
Microsoft Teams is the prefered hub for teamwork and collaboration tool for numerous frontline and remote workers. As well Azure bots are an efficient solution to efficiently guide these employees or customers through complex processes spanning over multiple IT-backends. 
This hands-on lab will therefore demonstrate the implementation of an Azure bot for Microsoft Teams that mashes-up information from Microsoft 365 and SAP leveraging the particular Graph API of both vendors. 
Both Graph solutions enable developers to build business application using a single API, from SAP or Microsoft, that transparently provides information from various backend applications. 
Further resources about to the Microsoft- and SAP-Graph: 
* [SAP Graph BETA]( https://beta.graph.sap/)

![SAPGRAPH]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/SAP_GRAPH.png)
* [Microsoft Graph]( https://developer.microsoft.com/en-us/graph/graph-explorer)

![MICROSOFTGRAPH]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/MICROSOFT_GRAPH.png)

Regarding the Microsoft Graph demonstrating Azure Active Directory (AD) functionality like SSO and OAuth is intended as an important aspect of this exercise. 
Furthermore, this hands-on tutorial will describe the complete setup of the development from environment scratch, for enabling developers to extend this example with their own ideas or customer scenarios. 
# Business scenario and context
This lab is developed based on a basic theoretical business scenario with the following assumptions and process:
* Call center agent or frontline employee with Microsoft Teams a preferred user-interface
* Customer requesting an update about an order via email 
* The call center agent processes the customer inquiry utilizing a chatbot in teams
* The first step of the business process is the search the agents Outlook inbox for customer inquiries.  (MS Graph API)
* After the customer is identified the chatbot then enables the agent to search within the SAP sales order for the open order status (SAP Graph API)
* Optional: The agent now could send an email using the MS Graph API to update the customer about the sales orders status. 
Summarized is the intention of the lab to demonstrate the simple access to Microsoft and SAP business data utilizing modern APIs. 
![BusinessScenario]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/ScenarioOverview.png)
# Setup of the development environment 
In order the run the lab and even more important, to further extend this example, an essential aspect and exercise of this lab is to setup the development environment. Programming environment and language is Node.JS, therefore Java- or Java-Script knowledge is recommended. 
Therefore, the first hands on exercise is to install the following components in the development environment: 
* [Visual Studio Code]( https://code.visualstudio.com/download)
* [Microsoft Graph]( https://developer.microsoft.com/en-us/graph/graph-explorer)
* [Git Client]( https://git-scm.com/download/win)
* [NGORK Client]( https://github.com/Microsoft/botbuilder-samples.git) + Set the Windows PATH Enviornment Variable 
* [Teams App Studio]( https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/app-studio-overview)

The example was built on top of the Bot Builder sample code-library and for development purposes a development Microsoft 365 tenant helpful. 
In addition, the Bot-Framework emulator was helpful to test bot functionality without firs without having to deploy to Teams. 
Optional: 
* [Bot Framework Emulator]( https://github.com/microsoft/BotFramework-Emulator)
* [Bot Builder samples]( https://github.com/microsoft/BotBuilder-Samples)
* [Microsoft 365 developer sandbox]( https://developer.microsoft.com/en-us/microsoft-365/dev-program)
The recommendation is as well to gain knowledge about Bot Builder by understanding the Bot Builder sample exercises. 
The source-code of this lab is implemented based on the Bot Builder sample [24. MS Graph authentication]( https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/24.bot-authentication-msgraph)
and [46. Teams authentication]( https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/46.teams-auth)

# Local application setup 
The deployment of the chatbot will be implemented using a local version and an external tunnel to forward the communication to the Azure chatbot channel. 
After the time-consuming installation prework the manual deployment can be done with a few lines Windows Power Shell. 
The specific next steps to implement are: 
•	Open Visual Studio Code
•	Open two PowerShell terminals 
•	The commands for the first terminal to start the application: 
```
git clone https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph.git
cd .\TEAMS-Chatbot-Microsoft-SAP-Graph\
node install 
node .\index.js
```
•	The command for the second terminal to start the ngork forwarding: 
```
ngrok http -host-header=rewrite 3978
```
After the successful implementation of the steps the result should look as following: 
![VisualStudioCode]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/VisualStudioCodeConfig.png)

Please note the ngork HTTPS forwarding URL(https:/xxxx.ngork.io) as marked on the screenshot above.  

# Azure AD App registration 
After successful installation of the development environment and local deployment of the application the next step is to configure the App registration for authentication and corresponding Microsoft Graph API permissions. 
The necessary steps are already described in this tutorial: 
[Add authentication to your Teams bot](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=node-js%2Cdotnet-sample#prepare-the-bot-sample-code)

Please finish this tutorial until [Prepare the bot sample code](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=node-js%2Cdotnet-sample#prepare-the-bot-sample-code) and in addition tot he tutorial modify the [identity provider](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=node-js%2Cdotnet-sample#prepare-the-bot-sample-code) with the following API permissions: 
![IPGraphAPIPermission]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/IP_GRAPH_API_PERMISSIONS.png)
In case of further customer scenarios or development concepts, these permissions for the MS Graph API access might have to be adjusted. One example to further extend this scenario would be implementing the [Microsoft Search API](https://docs.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-beta). 
As written in the tutorial the *.env configuration file must be updated with the App ID and customer secret from the bot channel registration. In addition, the connectionName of the identity provider must be set:
```
MicrosoftAppId=App Id from Bot channel 
MicrosoftAppPassword=Customer password from Bot channel 
connectionName=Identity provider connection 
```

# Install and test the bot with the emulator and Teams. 
To test the bot with the local bot emulator please implement this section of the tutorial: 
*  [Test the bot using the Emulator]( https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=node-js%2Cdotnet-sample#install-and-test-the-bot-in-teams).
![BOTEMULATOR]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/ChatBotEmulator.png)

*  [Testing the bot locally in Teams
]( https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=node-js%2Cdotnet-sample#testing-the-bot-locally-in-teams)

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
![TEAMSAPPSTUDIO]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/TEAMS_APP_STUDIO.png)

# Demo-flow and API consumption
After successful local testing local bot in Teams the demo-flow will be as following. 
## Azure AD logon and granting API permission for MS Graph 
When the user logons for the first time the API permission for MS Graph must be granted by the user: 
![DEMOFLOWAD1]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/DemoFlowAD1.png)
![DEMOFLOWAD2]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/DemoFlowAD2.png)
After successful logon and API permission authorization the Outlook Inbox if the user will be displayed. In the demo the agent will look for customer e-mails asking for order statuses. 
![DEMOFLOWMSGRAPH]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/DemoFlowMSGraphQuery.png)
The call-center agent will now pick a customer name and search for this customer’s sales order via the SAP Graph. Technically the search query will invoke to SAP Graph APIs to:
*  Search for the SAP customer ID via first and last name.  
*  Search for SAP sales orders based on the SAP customer ID queried previously. 
![DEMOFLOWSAPGRAPH]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/DemoFlowSAPGraphQuery.png)
For displaying the results of the Graph queries basic were implemented. 
[Adaptive Cards]( https://docs.microsoft.com/en-us/adaptive-cards/)
Here the demo ends for now and as further enhancement different actions could be triggered by the call-center agent now. One example could be sending an email with an update about the order status or a call via Teams. 

# Summary and next steps 
As stated at the beginning of this document, the intention of this lab is to enable developers in extending and modifying this starter implementation. 
In addition, the motivation is to demonstrate how business processes based on Microsoft and SAP enterprise applications could be easily joined within an intuitive user-interface like the Azure Bot in Microsoft Teams and modern APIs like the SAP- and Microsoft-Graph:
* SAP Graph (Beta) with currently public Bearer token
* Improve adaptive cards layout 
* Implement Microsoft Graph Search API to search beyond Inbox 





