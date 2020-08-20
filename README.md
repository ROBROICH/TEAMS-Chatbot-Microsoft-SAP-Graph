# Hands-On Lab: Implementing a Node.JS client as Chatbot to achieve principal propagation between Azure and SAP Netweaver (OAuth2 SAML Bearer Assertion Flow)

# Introduction 
This Hands-On lab demonstrates how to establish principal propagation between Azure and SAP Netweaver. 
In a nutshell this scenario enables Azure developers to implement cloud-native Azure applications and consume OData data-sources from SAP including applying the ABAP authorizations of the user-logged on to Azure AD. 
In practice the Azure user will be mapped to the corresponding SAP ABAP user when invoking the SAP Netweaver OData service. This approach allows to reuse existing SAP NW security, authorization- and role-concepts within Azure based applications like the Chatbot in this example. 
This lab demonstrates on the implementation of a basic Node.JS client as foundation to display the SAP data in Microsoft Teams using an Azure Bot. 
This scenario is typically known as the OAuth2 SAML Bearer Assertion Flow. 

# Development environment setup 
This lab is an extension of the existing [Microsoft & SAP Graph Chatbot]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph) Hands-On Lab. 
The general setup of the development is described in this predecessor lab and hence it is recommended to implement this lab in case the development environment must be setup initially.
The second essential prerequisite for implementing this lab is the configuration Azure Active Directory(AZ AD) and SAP Netwaver (SAP NW) to support the OAuth2 SAML Bearer Assertion Flow. 
This detailed configuration of Azure AD and SAP NW is displayed in the following Azure Developer College repository provided by the German Microsoft OCP CSA team. 
The documentation can be found [here]( https://github.com/azuredevcollege/SAP). 





When implementing the Microsoft Graph demonstrating the Azure Active Directory (AD) integration with functionality like SSO and API permissions is intended as an important aspect of this exercise. 

Currently Azure AD integration with the SAP Graph (BETA) is not possible, a public Bearer token was used. 

Furthermore, this hands-on tutorial will describe the complete setup of the development from environment from scratch. 

This setup and corresponding documentation are intended for enabling developers to extend this example with their own ideas or customer scenarios. 
# Business scenario and context
This lab is developed based on a basic theoretical business scenario with the following assumptions and processes:
* The call center agent or frontline employee uses Microsoft Teams as preferred user-interface
* The customer is requesting an update about an order via email 
* The call center agent processes the customer inquiry utilizing a chatbot in MS Teams
* The first step of the business process is to the search the agents Outlook inbox for customer inquiries via the MS Graph API
* After the customer is identified via the first- and last-name, the chatbot then enables the agent to search within the SAP sales order for the open order status via the SAP Graph API
* Optional / Next step: The agent now could send an email using the MS Graph API to update the customer about the sales orders status. 


Summarized: 

The purpose of this lab is to demonstrate the simple integration of Microsoft and SAP business- and process-data utilizing modern and open APIs. 

![BusinessScenario]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/ScenarioOverview.png)
# Setup of the development environment 
In order to run the lab and even more important to further extend this example, an essential aspect and exercise of this lab is to setup the development environment. Programming-environment and -language is Node.JS, therefore Java- or Java-Script knowledge is recommended. 
The first action or hands on exercise is to install the following components in the development environment: 
* [Visual Studio Code]( https://code.visualstudio.com/download)
* [Microsoft Graph]( https://developer.microsoft.com/en-us/graph/graph-explorer)
* [Git Client]( https://git-scm.com/download/win)
* [NGORK Client]( https://github.com/Microsoft/botbuilder-samples.git) + Set the Windows PATH Enviornment Variable 
* [Teams App Studio]( https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/app-studio-overview)

