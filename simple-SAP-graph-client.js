// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var http = require('http');

// Test-Data: Jane Jackson ID: 1000482

/**
 * This class is a wrapper for the SAP Graph API.
  */
class SimpleSAPGraphClient {
    constructor() {
        this.URL = 'api.graph.sap';
        this.SAP_GRAPH_VERSION = process.env.SAPGraphVersion;
        this.AUTHTYPE_PUBLIC_TOKEN = process.env.SAPAuthBearerToken;
        this.AUTHTYPE = 'Bearer';
    }

    async getCustomersByLastName(customerLastName) {
        const servicePath = '/' + this.SAP_GRAPH_VERSION + '/Customers?$filter=tolower(lastName)%20eq%20tolower(\'' + customerLastName + '\')';
        return await this.get(servicePath);
    }

    async getSalesOrderForCustomerId(customerId) {
        const servicePath = '/' + this.SAP_GRAPH_VERSION + '/Customers/' + customerId + '/SalesOrders';
        return await this.get(servicePath);
    }

    async get(path) {
        return new Promise((resolve, reject) => {
            http.get({
                protocol: 'http:',
                hostname: this.URL,
                port: 80,
                path: path,
                headers: {
                    Authorization: this.AUTHTYPE + ' ' + this.AUTHTYPE_PUBLIC_TOKEN
                }
            },
            (response) => {
                let body = '';
                // Hack/Fix because event was fired twice returning an empty result
                response.on('data', function(data) {
                    body += String(data);
                });

                response.on('end', function() {
                    console.log(body);
                    resolve(JSON.parse(body));
                });
            }).on('error', (err) => {
                console.log('Error: ' + err.message);
                reject('Error: ' + err.message);
            });
        });
    }
}

exports.SimpleSAPGraphClient = SimpleSAPGraphClient;
