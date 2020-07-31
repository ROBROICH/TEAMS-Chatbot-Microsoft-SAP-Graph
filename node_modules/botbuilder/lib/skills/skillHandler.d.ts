/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity, ActivityHandlerBase, BotAdapter, ResourceResponse } from 'botbuilder-core';
import { AuthenticationConfiguration, ICredentialProvider, ClaimsIdentity } from 'botframework-connector';
import { ChannelServiceHandler } from '../channelServiceHandler';
import { SkillConversationIdFactoryBase } from './skillConversationIdFactoryBase';
/**
 * A Bot Framework Handler for skills.
 */
export declare class SkillHandler extends ChannelServiceHandler {
    private readonly adapter;
    private readonly bot;
    private readonly conversationIdFactory;
    readonly SkillConversationReferenceKey: Symbol;
    /**
     * Initializes a new instance of the SkillHandler class.
     * @param adapter An instance of the BotAdapter that will handle the request.
     * @param bot The ActivityHandlerBase instance.
     * @param conversationIdFactory A SkillConversationIdFactoryBase to unpack the conversation ID and map it to the calling bot.
     * @param credentialProvider The credential provider.
     * @param authConfig The authentication configuration.
     * @param channelService The string indicating if the bot is working in Public Azure or in Azure Government (https://aka.ms/AzureGovDocs).
     */
    constructor(adapter: BotAdapter, bot: ActivityHandlerBase, conversationIdFactory: SkillConversationIdFactoryBase, credentialProvider: ICredentialProvider, authConfig: AuthenticationConfiguration, channelService?: string);
    /**
     * sendToConversation() API for Skill.
     * @remarks
     * This method allows you to send an activity to the end of a conversation.
     *
     * This is slightly different from replyToActivity().
     * * sendToConversation(conversationId) - will append the activity to the end
     * of the conversation according to the timestamp or semantics of the channel.
     * * replyToActivity(conversationId,ActivityId) - adds the activity as a reply
     * to another activity, if the channel supports it. If the channel does not
     * support nested replies, replyToActivity falls back to sendToConversation.
     *
     * Use replyToActivity when replying to a specific activity in the conversation.
     *
     * Use sendToConversation in all other cases.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param activity Activity to send.
     * @returns A Promise with a ResourceResponse.
     */
    protected onSendToConversation(claimsIdentity: ClaimsIdentity, conversationId: string, activity: Activity): Promise<ResourceResponse>;
    /**
     * replyToActivity() API for Skill.
     * @remarks
     * This method allows you to reply to an activity.
     *
     * This is slightly different from sendToConversation().
     * * sendToConversation(conversationId) - will append the activity to the end
     * of the conversation according to the timestamp or semantics of the channel.
     * * replyToActivity(conversationId,ActivityId) - adds the activity as a reply
     * to another activity, if the channel supports it. If the channel does not
     * support nested replies, replyToActivity falls back to sendToConversation.
     *
     * Use replyToActivity when replying to a specific activity in the conversation.
     *
     * Use sendToConversation in all other cases.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param activityId activityId the reply is to.
     * @param activity Activity to send.
     * @returns A Promise with a ResourceResponse.
     */
    protected onReplyToActivity(claimsIdentity: ClaimsIdentity, conversationId: string, activityId: string, activity: Activity): Promise<ResourceResponse>;
    private static applyEoCToTurnContextActivity;
    private static applyEventToTurnContextActivity;
    private processActivity;
}
