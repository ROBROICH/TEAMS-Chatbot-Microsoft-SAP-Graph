/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { BotFrameworkAdapter } from '../botFrameworkAdapter';
import { Activity, TurnContext } from 'botbuilder-core';
/**
 * Looks for OAuthCards in Activity attachments and takes action on them
 */
export declare class TokenResolver {
    private static readonly PollingIntervalMs;
    static checkForOAuthCards(adapter: BotFrameworkAdapter, context: TurnContext, activity: Activity, log?: string[]): void;
    private static pollForToken;
    private static createTokenResponseActivity;
    private static generate_guid;
}
