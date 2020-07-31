/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity } from 'botbuilder-core';
import { ICredentialProvider } from 'botframework-connector';
import { InvokeResponse } from './botFrameworkAdapter';
/**
 * HttpClient for calling skills from a Node.js BotBuilder V4 SDK bot.
 */
export declare class BotFrameworkHttpClient {
    private readonly credentialProvider;
    private readonly channelService?;
    /**
     * Cache for appCredentials to speed up token acquisition (a token is not requested unless is expired)
     * AppCredentials are cached using appId + scope (this last parameter is only used if the app credentials are used to call a skill)
     */
    private static readonly appCredentialMapCache;
    constructor(credentialProvider: ICredentialProvider, channelService?: string);
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
    postActivity(fromBotId: string, toBotId: string, toUrl: string, serviceUrl: string, conversationId: string, activity: Activity): Promise<InvokeResponse>;
    /**
     * Gets the application credentials. App Credentials are cached so as to ensure we are not refreshing
     * token every time.
     * @private
     * @param appId The application identifier (AAD Id for the bot).
     * @param oAuthScope The scope for the token, skills will use the Skill App Id.
     */
    private getAppCredentials;
}
