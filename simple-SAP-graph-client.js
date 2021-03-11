// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const axios = require('axios');

// Test-Data: Jane Jackson ID: 1000482

/**
 * This class is a wrapper for the SAP Graph API.
  */
class SimpleSAPGraphClient {
    constructor() {
        this.URL = process.env.SAPGraphInstance;
        this.SAP_GRAPH_VERSION = process.env.SAPGraphVersion;
        this.AUTHTYPE_PUBLIC_TOKEN = process.env.SAPAuthBearerToken;
        this.AUTHTYPE = 'Bearer';
    }

    async getOrderByOrderNumber(ordernumber) {
        const servicePath = this._getServicePath() + "/CustomerOrder?$filter=displayId%20eq%20'" + ordernumber + "'";
        const config = {
            method: 'get',
            headers: { Authorization: this.AUTHTYPE + ' ' + this.AUTHTYPE_PUBLIC_TOKEN }
        };
        return (await axios.get(servicePath, config)).data.value;
    }

    async getCustomerBySalesOrder(salesOrder) {
        const servicePath = this._getServicePath() + "/Customer/" + salesOrder.customer.id;
        const config = {
            method: 'get',
            headers: { Authorization: this.AUTHTYPE + ' ' + this.AUTHTYPE_PUBLIC_TOKEN }
        };
        return (await axios.get(servicePath, config)).data;
    }

    _getServicePath() {
        return 'https://' + this.URL + '/' + process.env.SAPGraphArea + '/' + this.SAP_GRAPH_VERSION + '/' + process.env.SAPGraphNamespace;
    }
}

exports.SimpleSAPGraphClient = SimpleSAPGraphClient;
