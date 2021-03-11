// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

let {
  BusinessPartner,
} = require('@sap/cloud-sdk-vdm-business-partner-service');
let {
  SalesOrder,
  SalesOrderItem,
} = require('@sap/cloud-sdk-vdm-sales-order-service');

/**
 * Wrapperclass for the SAP API Hub.
 */
class SimpleSAPAPIHubClient {
  async getCustomersByLastName(customerLastName) {
    return BusinessPartner.requestBuilder()
      .getAll()
      .select(
        BusinessPartner.BUSINESS_PARTNER,
        BusinessPartner.BUSINESS_PARTNER_NAME
      )
      .filter(BusinessPartner.BUSINESS_PARTNER_NAME.equals(customerLastName))
      .top(5)
      .addCustomHeaders({ APIKey: process.env.SAPAPIHubKey })
      .execute({
        url: process.env.SAPAPIHubDestination,
      });
  }

  async getSalesOrderForCustomerId(customerId) {
    return SalesOrder.requestBuilder()
      .getAll()
      .select(SalesOrder.ALL_FIELDS, SalesOrder.TO_ITEM)
      .filter(SalesOrder.SOLD_TO_PARTY.equals(customerId))
      .top(5)
      .addCustomHeaders({ APIKey: process.env.SAPAPIHubKey })
      .execute({
        url: process.env.SAPAPIHubDestination,
      });
  }
  //.addCustomQueryParameters({'expand':'to_Item'})
}

exports.SimpleSAPAPIHubClient = SimpleSAPAPIHubClient;
