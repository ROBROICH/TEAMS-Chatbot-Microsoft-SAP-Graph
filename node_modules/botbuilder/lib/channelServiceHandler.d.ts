/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity, AttachmentData, ChannelAccount, ConversationParameters, ConversationResourceResponse, ConversationsResult, PagedMembersResult, ResourceResponse, Transcript } from 'botbuilder-core';
import { AuthenticationConfiguration, ClaimsIdentity, ICredentialProvider } from 'botframework-connector';
/**
 * The ChannelServiceHandler implements API to forward activity to a skill and
 * implements routing ChannelAPI calls from the Skill up through the bot/adapter.
 */
export declare class ChannelServiceHandler {
    private readonly credentialProvider;
    private readonly authConfig;
    private readonly channelService?;
    /**
     * Initializes a new instance of the ChannelServiceHandler class, using a credential provider.
     * @param credentialProvider The credential provider.
     * @param authConfig The authentication configuration.
     * @param channelService A string representing the channel provider.
     */
    constructor(credentialProvider: ICredentialProvider, authConfig: AuthenticationConfiguration, channelService?: string);
    handleSendToConversation(authHeader: string, conversationId: string, activity: Activity): Promise<ResourceResponse>;
    handleReplyToActivity(authHeader: string, conversationId: string, activityId: string, activity: Activity): Promise<ResourceResponse>;
    handleUpdateActivity(authHeader: string, conversationId: string, activityId: string, activity: Activity): Promise<ResourceResponse>;
    handleDeleteActivity(authHeader: string, conversationId: string, activityId: string): Promise<void>;
    handleGetActivityMembers(authHeader: string, conversationId: string, activityId: string): Promise<ChannelAccount[]>;
    handleCreateConversation(authHeader: string, parameters: ConversationParameters): Promise<ConversationResourceResponse>;
    handleGetConversations(authHeader: string, conversationId: string, continuationToken?: string): Promise<ConversationsResult>;
    handleGetConversationMembers(authHeader: string, conversationId: string): Promise<ChannelAccount[]>;
    handleGetConversationPagedMembers(authHeader: string, conversationId: string, pageSize?: number, continuationToken?: string): Promise<PagedMembersResult>;
    handleDeleteConversationMember(authHeader: string, conversationId: string, memberId: string): Promise<void>;
    handleSendConversationHistory(authHeader: string, conversationId: string, transcript: Transcript): Promise<ResourceResponse>;
    handleUploadAttachment(authHeader: string, conversationId: string, attachmentUpload: AttachmentData): Promise<ResourceResponse>;
    /**
     * SendToConversation() API for Skill.
     * @remarks
     * This method allows you to send an activity to the end of a conversation.
     * This is slightly different from ReplyToActivity().
     * * SendToConversation(conversationId) - will append the activity to the end
     * of the conversation according to the timestamp or semantics of the channel.
     * * ReplyToActivity(conversationId,ActivityId) - adds the activity as a reply
     * to another activity, if the channel supports it. If the channel does not
     * support nested replies, ReplyToActivity falls back to SendToConversation.
     *
     * Use ReplyToActivity when replying to a specific activity in the
     * conversation.
     *
     * Use SendToConversation in all other cases.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId
     * @param activity
     */
    protected onSendToConversation(claimsIdentity: ClaimsIdentity, conversationId: string, activity: Activity): Promise<ResourceResponse>;
    /**
     * ReplyToActivity() API for Skill.
     * @remarks
     * This method allows you to reply to an activity.
     *
     * This is slightly different from SendToConversation().
     * * SendToConversation(conversationId) - will append the activity to the end
     * of the conversation according to the timestamp or semantics of the channel.
     * * ReplyToActivity(conversationId,ActivityId) - adds the activity as a reply
     * to another activity, if the channel supports it. If the channel does not
     * support nested replies, ReplyToActivity falls back to SendToConversation.
     *
     * Use ReplyToActivity when replying to a specific activity in the
     * conversation.
     *
     * Use SendToConversation in all other cases.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param activityId activityId the reply is to (OPTIONAL).
     * @param activity Activity to send.
     */
    protected onReplyToActivity(claimsIdentity: ClaimsIdentity, conversationId: string, activityId: string, activity: Activity): Promise<ResourceResponse>;
    /**
     * UpdateActivity() API for Skill.
     * @remarks
     * Edit an existing activity.
     *
     * Some channels allow you to edit an existing activity to reflect the new
     * state of a bot conversation.
     *
     * For example, you can remove buttons after someone has clicked "Approve" button.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param activityId activityId to update.
     * @param activity replacement Activity.
     */
    protected onUpdateActivity(claimsIdentity: ClaimsIdentity, conversationId: string, activityId: string, activity: Activity): Promise<ResourceResponse>;
    /**
     * DeleteActivity() API for Skill.
     * @remarks
     * Delete an existing activity.
     *
     * Some channels allow you to delete an existing activity, and if successful
     * this method will remove the specified activity.
     *
     *
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param activityId activityId to delete.
     */
    protected onDeleteActivity(claimsIdentity: ClaimsIdentity, conversationId: string, activityId: string): Promise<void>;
    /**
     * GetActivityMembers() API for Skill.
     * @remarks
     * Enumerate the members of an activity.
     *
     * This REST API takes a ConversationId and a ActivityId, returning an array
     * of ChannelAccount objects representing the members of the particular
     * activity in the conversation.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param activityId Activity ID.
     */
    protected onGetActivityMembers(claimsIdentity: ClaimsIdentity, conversationId: string, activityId: string): Promise<ChannelAccount[]>;
    /**
     * CreateConversation() API for Skill.
     * @remarks
     * Create a new Conversation.
     *
     * POST to this method with a
     * * Bot being the bot creating the conversation
     * * IsGroup set to true if this is not a direct message (default is false)
     * * Array containing the members to include in the conversation
     *
     * The return value is a ResourceResponse which contains a conversation id
     * which is suitable for use in the message payload and REST API uris.
     *
     * Most channels only support the semantics of bots initiating a direct
     * message conversation.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param parameters Parameters to create the conversation from.
     */
    protected onCreateConversation(claimsIdentity: ClaimsIdentity, parameters: ConversationParameters): Promise<ConversationResourceResponse>;
    /**
     * onGetConversations() API for Skill.
     * @remarks
     * List the Conversations in which this bot has participated.
     *
     * GET from this method with a skip token
     *
     * The return value is a ConversationsResult, which contains an array of
     * ConversationMembers and a skip token.  If the skip token is not empty, then
     * there are further values to be returned. Call this method again with the
     * returned token to get more values.
     *
     * Each ConversationMembers object contains the ID of the conversation and an
     * array of ChannelAccounts that describe the members of the conversation.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param continuationToken Skip or continuation token.
     */
    protected onGetConversations(claimsIdentity: ClaimsIdentity, conversationId: string, continuationToken?: string): Promise<ConversationsResult>;
    /**
     * getConversationMembers() API for Skill.
     * @remarks
     * Enumerate the members of a conversation.
     *
     * This REST API takes a ConversationId and returns an array of ChannelAccount
     * objects representing the members of the conversation.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     */
    protected onGetConversationMembers(claimsIdentity: ClaimsIdentity, conversationId: string): Promise<ChannelAccount[]>;
    /**
     * getConversationPagedMembers() API for Skill.
     * @remarks
     * Enumerate the members of a conversation one page at a time.
     *
     * This REST API takes a ConversationId. Optionally a pageSize and/or
     * continuationToken can be provided. It returns a PagedMembersResult, which
     * contains an array
     * of ChannelAccounts representing the members of the conversation and a
     * continuation token that can be used to get more values.
     *
     * One page of ChannelAccounts records are returned with each call. The number
     * of records in a page may vary between channels and calls. The pageSize
     * parameter can be used as
     * a suggestion. If there are no additional results the response will not
     * contain a continuation token. If there are no members in the conversation
     * the Members will be empty or not present in the response.
     *
     * A response to a request that has a continuation token from a prior request
     * may rarely return members from a previous request.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param pageSize Suggested page size.
     * @param continuationToken Continuation Token.
     */
    protected onGetConversationPagedMembers(claimsIdentity: ClaimsIdentity, conversationId: string, pageSize?: number, continuationToken?: string): Promise<PagedMembersResult>;
    /**
     * DeleteConversationMember() API for Skill.
     * @remarks
     * Deletes a member from a conversation.
     *
     * This REST API takes a ConversationId and a memberId (of type string) and
     * removes that member from the conversation. If that member was the last member
     * of the conversation, the conversation will also be deleted.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param memberId ID of the member to delete from this conversation.
     */
    protected onDeleteConversationMember(claimsIdentity: ClaimsIdentity, conversationId: string, memberId: string): Promise<void>;
    /**
     * SendConversationHistory() API for Skill.
     * @remarks
     * This method allows you to upload the historic activities to the
     * conversation.
     *
     * Sender must ensure that the historic activities have unique ids and
     * appropriate timestamps. The ids are used by the client to deal with
     * duplicate activities and the timestamps are used by the client to render
     * the activities in the right order.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param transcript Transcript of activities.
     */
    protected onSendConversationHistory(claimsIdentity: ClaimsIdentity, conversationId: string, transcript: Transcript): Promise<ResourceResponse>;
    /**
     * UploadAttachment() API for Skill.
     * @remarks
     * Upload an attachment directly into a channel's blob storage.
     *
     * This is useful because it allows you to store data in a compliant store
     * when dealing with enterprises.
     *
     * The response is a ResourceResponse which contains an AttachmentId which is
     * suitable for using with the attachments API.
     * @param claimsIdentity ClaimsIdentity for the bot, should have AudienceClaim, AppIdClaim and ServiceUrlClaim.
     * @param conversationId Conversation ID.
     * @param attachmentUpload Attachment data.
     */
    protected onUploadAttachment(claimsIdentity: ClaimsIdentity, conversationId: string, attachmentUpload: AttachmentData): Promise<ResourceResponse>;
    private authenticate;
}
