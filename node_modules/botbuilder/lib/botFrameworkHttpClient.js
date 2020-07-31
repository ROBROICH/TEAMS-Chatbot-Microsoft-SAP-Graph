"use strict";
/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const botframework_connector_1 = require("botframework-connector");
const botFrameworkAdapter_1 = require("./botFrameworkAdapter");
/**
 * HttpClient for calling skills from a Node.js BotBuilder V4 SDK bot.
 */
class BotFrameworkHttpClient {
    constructor(credentialProvider, channelService) {
        this.credentialProvider = credentialProvider;
        this.channelService = channelService;
        if (!this.credentialProvider) {
            throw new Error('BotFrameworkHttpClient(): missing credentialProvider');
        }
        if (!this.channelService) {
            this.channelService = process.env[botframework_connector_1.AuthenticationConstants.ChannelService];
        }
    }
    /**
     * Forwards an activity to a another bot.
     * @remarks
     *
     * @param fromBotId The MicrosoftAppId of the bot sending the activity.
     * @param toBotId The MicrosoftAppId of the bot receiving the activity.
     * @param toUrl The URL of the bot receiving the activity.
     * @param serviceUrl The callback Url for the skill host.
     * @param conversationId A conversation ID to use for the conversation with the skill.
     * @param activity Activity to forward.
     */
    postActivity(fromBotId, toBotId, toUrl, serviceUrl, conversationId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            const appCredentials = yield this.getAppCredentials(fromBotId, toBotId);
            if (!appCredentials) {
                throw new Error('BotFrameworkHttpClient.postActivity(): Unable to get appCredentials to connect to the skill');
            }
            // Get token for the skill call
            const token = appCredentials.appId === '' && appCredentials.appPassword === '' ? null : yield appCredentials.getToken();
            // Capture current activity settings before changing them.
            // TODO: DO we need to set the activity ID? (events that are created manually don't have it).
            const originalConversationId = activity.conversation.id;
            const originalServiceUrl = activity.serviceUrl;
            const originalCallerId = activity.callerId;
            try {
                activity.conversation.id = conversationId;
                activity.serviceUrl = serviceUrl;
                activity.callerId = fromBotId;
                const config = {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'User-Agent': botFrameworkAdapter_1.USER_AGENT
                    }
                };
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                const response = yield axios_1.default.post(toUrl, activity, config);
                const invokeResponse = { status: response.status, body: response.data };
                return invokeResponse;
            }
            finally {
                // Restore activity properties.
                activity.conversation.id = originalConversationId;
                activity.serviceUrl = originalServiceUrl;
                activity.callerId = originalCallerId;
            }
        });
    }
    /**
     * Gets the application credentials. App Credentials are cached so as to ensure we are not refreshing
     * token every time.
     * @private
     * @param appId The application identifier (AAD Id for the bot).
     * @param oAuthScope The scope for the token, skills will use the Skill App Id.
     */
    getAppCredentials(appId, oAuthScope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!appId) {
                return new botframework_connector_1.MicrosoftAppCredentials('', '');
            }
            const cacheKey = `${appId}${oAuthScope}`;
            let appCredentials = BotFrameworkHttpClient.appCredentialMapCache.get(cacheKey);
            if (appCredentials) {
                return appCredentials;
            }
            const appPassword = yield this.credentialProvider.getAppPassword(appId);
            if (botframework_connector_1.JwtTokenValidation.isGovernment(this.channelService)) {
                appCredentials = new botframework_connector_1.MicrosoftAppCredentials(appId, appPassword, this.channelService, oAuthScope);
                appCredentials.oAuthEndpoint = botframework_connector_1.GovernmentConstants.ToChannelFromBotLoginUrl;
                appCredentials.oAuthScope = botframework_connector_1.GovernmentConstants.ToChannelFromBotOAuthScope;
            }
            else {
                appCredentials = new botframework_connector_1.MicrosoftAppCredentials(appId, appPassword, this.channelService, oAuthScope);
            }
            // Cache the credentials for later use
            BotFrameworkHttpClient.appCredentialMapCache.set(cacheKey, appCredentials);
            return appCredentials;
        });
    }
}
/**
 * Cache for appCredentials to speed up token acquisition (a token is not requested unless is expired)
 * AppCredentials are cached using appId + scope (this last parameter is only used if the app credentials are used to call a skill)
 */
BotFrameworkHttpClient.appCredentialMapCache = new Map();
exports.BotFrameworkHttpClient = BotFrameworkHttpClient;
//# sourceMappingURL=botFrameworkHttpClient.js.map