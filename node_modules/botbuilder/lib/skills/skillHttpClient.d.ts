/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity } from 'botbuilder-core';
import { ICredentialProvider } from 'botframework-connector';
import { InvokeResponse } from '../botFrameworkAdapter';
import { BotFrameworkHttpClient } from '../botFrameworkHttpClient';
import { BotFrameworkSkill } from './botFrameworkSkill';
import { SkillConversationIdFactoryBase } from './skillConversationIdFactoryBase';
/**
 * A BotFrameworkHttpClient specialized for Skills that encapsulates Conversation ID generation.
 */
export declare class SkillHttpClient extends BotFrameworkHttpClient {
    private readonly conversationIdFactory;
    constructor(credentialProvider: ICredentialProvider, conversationIdFactory: SkillConversationIdFactoryBase, channelService?: string);
    postToSkill(fromBotId: string, toSkill: BotFrameworkSkill, serviceUrl: string, activity: Activity): Promise<InvokeResponse>;
}
