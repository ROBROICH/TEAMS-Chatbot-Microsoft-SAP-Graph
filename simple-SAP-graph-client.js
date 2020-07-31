// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var http = require('http');


//Jane Jackson ID: 1000482

/**
 * This class is a wrapper for the Microsoft Graph API.
 * See: https://developer.microsoft.com/en-us/graph for more information.
 */
class SimpleSAPGraphClient {
    constructor() {
        this.URL = 'api.graph.sap'
        this.AUTHTYPE_PUBLIC_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkZW1vLmFwaS5ncmFwaC5zYXAiLCJzdWIiOiJkZW1vQGdyYXBoLnNhcCIsImF1ZCI6ImRlbW8uYXBpLmdyYXBoLnNhcCIsImlhdCI6MTU2MzgwMjEyMCwiZXhwIjo0Njg4MDA0NTIwLCJqdGkiOiI5OGMxM2E4MC0xNTQwLTQ3MDUtODg3MC0wYzM1NmQ2MjE0MDMifQ.JohYTPz1_CX0Q79ubkqyIC8NNOZF9cPSS0G89TUKQiDs0P407H6L0rlS6bijOkzek1h7JWno0jOBGoUQSAmSR0WX2abCwh26T3np2UxBkOx6ROkm_mpr-MtsGyOXM_9JPuZYv1nOnuuBYIOg-0zduO5ePuyWN29iEpmaCw1I6XxDp1_hzFAjS8GcKOmV8ilTrPTy_2UFc39qRLnur_bKtQb8-NleYHcv9uXChK3WEvEx7-NbCofKdkf_VVzuKpsDzzn2CvG2pKo3fFU_FLV56PA2D5kiprRz8FJyEUjslWPZCht0awQMRs7ml_e-srP3XykuXWMBBBV15yHNP8HdVA';
        this.AUTHTYPE = 'Authorization'
        this.LANDSCAPE = 'Landscape';

        this.authType = 'Bearer';
        this.landscapeName = 'Demo';

       // this.getSAPGraphData('Customer');

    }


     getSAPGraphData(servicePathURL, queryParameter) {
        const stringReplace = '%queryParameter%';

        this.servicePath = servicePathURL.replace(stringReplace, queryParameter);
        
        return new Promise((resolve, reject) => {
            http.get({
                protocol: "http:",
                hostname: this.URL,
                port: 80,
                path: this.servicePath,
                headers: {
                    Authorization: this.authType + ' ' + this.AUTHTYPE_PUBLIC_TOKEN
                }
            },
                 (response) =>{
                    
                    let body = '';
                    //Hack/Fix because event was fired twice returning an empty result
                    response.on('data', function (data) {
                            body += String(data);
                    });
                    
                    response.on('end', function () {
                        console.log(body);
                        resolve(JSON.parse(body));
                    });
                    
                 
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    reject("Error: " + err.message);
                  });
        });
 
    }




}

exports.SimpleSAPGraphClient = SimpleSAPGraphClient;





