# Hands-On Lab: Implementing a Node.JS client as Chatbot to achieve principal propagation between Azure and SAP Netweaver 

# Introduction 
This Hands-On lab demonstrates how to establish principal propagation, or an OAuth2 SAML Bearer Assertion Flow, between Azure AD and SAP Netweaver. 
In a nutshell this scenario enables Azure developers to implement cloud-native Azure applications and consume OData data-sources from SAP including applying the ABAP authorizations of the user-logged on to Azure AD. 
In practice the Azure user will be mapped to the corresponding SAP ABAP user when invoking the SAP Netweaver OData service. This approach allows to reuse existing SAP NW security, authorization- and role-concepts within Azure based applications like the Chatbot in this example. 
This lab demonstrates on the implementation of a basic Node.JS client as foundation to display the SAP data in Microsoft Teams using an Azure Bot. 

# Development environment setup 
This lab is an extension of the existing [Microsoft & SAP Graph Chatbot]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph) Hands-On Lab. 
The general setup of the development is described in this predecessor lab and hence it is recommended to implement this lab in case the development environment must be setup initially.
The second essential prerequisite for implementing this lab is the configuration Azure Active Directory(AZ AD) and SAP Netwaver (SAP NW) to support the OAuth2 SAML Bearer Assertion Flow. 
This detailed configuration of Azure AD and SAP NW is displayed in the following Azure Developer College repository provided by the German Microsoft One Commercial Partner(OCP) CSA team. 
The documentation can be found [here]( https://github.com/azuredevcollege/SAP). 
