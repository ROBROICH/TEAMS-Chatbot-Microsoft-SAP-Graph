# Hands-On Lab: Combining the Microsoft- Graph and SAP-Graph APIs in a Microsoft Teams chatbot senario. 

# Introduction and motivation
Microsoft Teams is the prefered user-interface and collaboration tools for many remote workers and Azure chatbots are an efficient solution to efficiently guide employees or customers through complex processes invoking multiple IT-backends. 
This hands-on lab will demonstrate the implementation Azure Chatbot for Microsoft Teams that combines information from Microsoft 365 and SAP leveraging the subsequent Graph APIs of both vendors. 
Both Graph solution enable developers to build business application using a single API that transparently provides information from various backend applications. 
Further resources about to the Microsoft- and SAP-Graph: 
* [SAP Graph BETA]( https://beta.graph.sap/)
* [Microsoft Graph]( https://developer.microsoft.com/en-us/graph/graph-explorer)

In regards to the Microsoft Graph demonstrating Azure Active Directory(AD) functionality like SSO and OAuth are an important aspect of this scenario too. 
This hands-on tutorial will describe the complete setup of the development environment to enable developers to extend this example with their own ideas or customer scenarios. 

# Business scenario and context
This lab is developed based on a basic hypothetical business scenario with the following assumptions and process:
* Call center agent or frontline employee with Microsoft Teams a preferred user-interface
* Customer requesting an update about an order via email 
* The call center agent processes the customer inquiry utilizing a chatbot in teams
* The first step of the business process is the search the agents Outlook inbox for customer inquiries.  (MS Graph API)
* After the customer is identified the chatbot then enables the agent to search within the SAP sales order for the open order status (SAP Graph API)
* Optional: The agent now could send an email using the MS Graph API to update the customer about the sales orders status. 
Summarized is the intention of the lab to demonstrate the simple access to Microsoft and SAP business data utilizing modern APIs. 
![BusinessScenario]( https://github.com/ROBROICH/TEAMS-Chatbot-Microsoft-SAP-Graph/blob/master/resources/ScenarioOverview.png)

