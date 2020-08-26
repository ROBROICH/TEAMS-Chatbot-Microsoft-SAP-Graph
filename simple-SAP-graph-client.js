// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var http = require('http');

// Test-Data: Jane Jackson ID: 1000482

/**
 * This class is a wrapper for the Microsoft Graph API.
 * See: https://developer.microsoft.com/en-us/graph for more information.
 */
class SimpleSAPGraphClient {
    constructor() {
        this.URL = 'api.graph.sap';
        this.AUTHTYPE_PUBLIC_TOKEN = process.env.SAPAuthBearerToken;
        this.AUTHTYPE = 'Authorization';
        this.LANDSCAPE = 'Landscape';

        this.authType = 'Bearer';
        this.landscapeName = process.env.SAPLandscape;
    }

    getSAPGraphData(servicePathURL, queryParameter) {
        const stringReplace = '%queryParameter%';

        this.servicePath = servicePathURL.replace(stringReplace, queryParameter);

        return new Promise((resolve, reject) => {
            http.get({
                protocol: 'http:',
                hostname: this.URL,
                port: 80,
                path: this.servicePath,
                headers: {
                    Authorization: this.authType + ' ' + this.AUTHTYPE_PUBLIC_TOKEN
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
