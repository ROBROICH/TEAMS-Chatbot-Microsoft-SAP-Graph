# Hands-On Lab: Combining the Microsoft- Graph and SAP-Graph APIs in a Microsoft Teams chatbot senario. 

# Introduction and motivation
Microsoft Teams is the prefered hub for teamwork and collaboration tool for numerous frontline and remote workers. As well Azure chatbots are an efficient solution to efficiently guide these employees or customers through complex processes spanning over multiple IT-backends. 
This hands-on lab will therefore demonstrate the implementation of an Azure Chatbot for Microsoft Teams that mashes-up information from Microsoft 365 and SAP leveraging the particular Graph API of both vendors. 
Both Graph solutions enable developers to build business application using a single API, from SAP or Microsoft, that transparently provides information from various backend applications. 
Further resources about to the Microsoft- and SAP-Graph: 
* [SAP Graph BETA]( https://beta.graph.sap/)
* [Microsoft Graph]( https://developer.microsoft.com/en-us/graph/graph-explorer)

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
The coding of this lab is implemented based on the Bot Builder sample [24. MS Graph authentication]( https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/24.bot-authentication-msgraph)
and [46. Teams authentication] (https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/46.teams-auth)
. 










