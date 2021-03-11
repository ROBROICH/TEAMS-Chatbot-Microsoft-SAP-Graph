// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
require("isomorphic-fetch");
const { Client } = require('@microsoft/microsoft-graph-client');

/**
 * This class is a wrapper for the Microsoft Graph API.
 * See: https://developer.microsoft.com/en-us/graph for more information.
 */
class SimpleMSGraphClient {
    constructor(token) {
        if (!token || !token.trim()) {
            throw new Error('SimpleMSGraphClient: Invalid token received.');
        }

         this._token = token;

        // Get an Authenticated Microsoft Graph client using the token issued to the user.
        try {
            // this.graphClient = Client.init({
            //     authProvider: (done) => {
            //         done(null, this._token); // First parameter takes an error if you can't get an access token.
            //     }
            // });
            this.graphClient = Client.initWithMiddleware({
                authProvider: new BotAuthenticationProvider(token)
            });
        } catch (error) {
            console.log(error);
        }
        
    }

    /**
     * Gets recent mail the user has received within the last hour and displays up to 5 of the emails in the bot.
     */
    async getRecentMail() {
        return await this.graphClient
            .api('/me/messages')
            .version('beta')
            .get().then((res) => {
                return res;
            });
    }

    /**
     * Collects information about the user in the bot.
     */
    async getMe() {
        return await this.graphClient
            .api('/me')
            .get().then((res) => {
                return res;
            });
    }
}

class BotAuthenticationProvider{
    constructor(token){
        this.token = token;
    }
	async getAccessToken() {
        return this.token;
    }
}

exports.SimpleMSGraphClient = SimpleMSGraphClient;
