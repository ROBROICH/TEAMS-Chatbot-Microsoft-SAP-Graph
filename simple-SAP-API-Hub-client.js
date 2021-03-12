// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

let {
  BusinessPartner,
  BpContactToAddress
} = require('@sap/cloud-sdk-vdm-business-partner-service');
let {
  SalesOrder,
  SalesOrderItem,
} = require('@sap/cloud-sdk-vdm-sales-order-service');

/**
 * Wrapperclass for the SAP API Hub.
 */
class SimpleSAPAPIHubClient {
  async getCustomerBySalesOrder(salesOrder) {
    let businessPartners = await BusinessPartner.requestBuilder()
      .getAll()
      .select(
        BusinessPartner.BUSINESS_PARTNER,
        BusinessPartner.BUSINESS_PARTNER_NAME,
        BusinessPartner.ORGANIZATION_BP_NAME_1,
        BusinessPartner.TO_BUSINESS_PARTNER_ADDRESS
      )
      .filter(BusinessPartner.BUSINESS_PARTNER.equals(salesOrder.customer.id))
      .top(1)
      .addCustomHeaders({ APIKey: process.env.SAPAPIHubKey })
      .execute({
        url: process.env.SAPAPIHubDestination,
      });
      
    return this.mapToSAPGraphCustomer(businessPartners[0]);
  }

  async getOrderByOrderNumber(orderNumber) {
    let salesOrders = await SalesOrder.requestBuilder()
    .getAll()
    .select(SalesOrder.ALL_FIELDS, SalesOrder.TO_ITEM)
    .filter(SalesOrder.SALES_ORDER.equals(orderNumber))
    .top(5)
    .addCustomHeaders({ APIKey: process.env.SAPAPIHubKey })
    .execute({
      url: process.env.SAPAPIHubDestination,
    });

    return [this.mapToSAPGraphSalesOrder(salesOrders[0])];
  }

  mapToSAPGraphSalesOrder(salesOrder){
    //ToDo read process status text
    let graphSalesOrder = {
        "displayId":salesOrder.salesOrder,
        "customer":{
            "id": salesOrder.soldToParty
        },
        "distributionChannel":{
            "name":salesOrder.distributionChannel
        },
        "division":{
            "name":salesOrder.organizationDivision
        },
        "orderDate": salesOrder.salesOrderDate._d.toISOString().substr(0,19) + 'Z',
        "netAmount":salesOrder.totalNetAmount,
        "currency":{
            "code":salesOrder.transactionCurrency
        },
        "processingStatus":{
            "code": salesOrder.overallSdProcessStatus,
            "name":"Open"
        },
        "items":[]
    }

    salesOrder.toItem.forEach(element => {
        graphSalesOrder.items.push({"text": element.salesOrderItemText,"netAmount": element.netAmount.c[0], "quantity": element.requestedQuantity.c[0]});
    });

    return graphSalesOrder;
  }

  mapToSAPGraphCustomer(businessPartner){
    //ToDo select phoneNumber
    //BpContactToAddress.TO_PHONE_NUMBER
    let phone = '112233';
    
    let graphCustomer = {
        "displayId":businessPartner.businessPartner,
        "addressData":[{
            "phoneNumbers":[
                {"number":phone}
            ]
        }],
        "organization":{
            "nameDetails":{
                "formattedOrgNameLine1":businessPartner.organizationBpName1
            }
        }
    }
    return graphCustomer;
  }

}

exports.SimpleSAPAPIHubClient = SimpleSAPAPIHubClient;
