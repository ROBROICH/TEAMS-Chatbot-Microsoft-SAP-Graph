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
const http_1 = require("http");
const botframework_connector_1 = require("botframework-connector");
const botFrameworkAdapter_1 = require("./botFrameworkAdapter");
/**
 * The ChannelServiceHandler implements API to forward activity to a skill and
 * implements routing ChannelAPI calls from the Skill up through the bot/adapter.
 */
class ChannelServiceHandler {
    /**
     * Initializes a new instance of the ChannelServiceHandler class, using a credential provider.
     * @param credentialProvider The credential provider.
     * @param authConfig The authentication configuration.
     * @param channelService A string representing the channel provider.
     */
    constructor(credentialProvider, authConfig, channelService) {
        this.credentialProvider = credentialProvider;
        this.authConfig = authConfig;
        this.channelService = channelService;
        if (!this.channelService) {
            this.channelService = process.env[botframework_connector_1.AuthenticationConstants.ChannelService];
        }
        if (!this.credentialProvider) {
            throw new Error('BotFrameworkHttpClient(): missing credentialProvider');
        }
        if (!this.authConfig) {
            throw new Error('BotFrameworkHttpClient(): missing authConfig');
        }
    }
    handleSendToConversation(authHeader, conversationId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onSendToConversation(claimsIdentity, conversationId, activity);
        });
    }
    handleReplyToActivity(authHeader, conversationId, activityId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onReplyToActivity(claimsIdentity, conversationId, activityId, activity);
        });
    }
    handleUpdateActivity(authHeader, conversationId, activityId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onUpdateActivity(claimsIdentity, conversationId, activityId, activity);
        });
    }
    handleDeleteActivity(authHeader, conversationId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            yield this.onDeleteActivity(claimsIdentity, conversationId, activityId);
        });
    }
    handleGetActivityMembers(authHeader, conversationId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onGetActivityMembers(claimsIdentity, conversationId, activityId);
        });
    }
    handleCreateConversation(authHeader, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onCreateConversation(claimsIdentity, parameters);
        });
    }
    handleGetConversations(authHeader, conversationId, continuationToken /* some default */) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onGetConversations(claimsIdentity, conversationId, continuationToken);
        });
    }
    handleGetConversationMembers(authHeader, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onGetConversationMembers(claimsIdentity, conversationId);
        });
    }
    handleGetConversationPagedMembers(authHeader, conversationId, pageSize = -1, continuationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onGetConversationPagedMembers(claimsIdentity, conversationId, pageSize, continuationToken);
        });
    }
    handleDeleteConversationMember(authHeader, conversationId, memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            yield this.onDeleteConversationMember(claimsIdentity, conversationId, memberId);
        });
    }
    handleSendConversationHistory(authHeader, conversationId, transcript) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onSendConversationHistory(claimsIdentity, conversationId, transcript);
        });
    }
    handleUploadAttachment(authHeader, conversationId, attachmentUpload) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimsIdentity = yield this.authenticate(authHeader);
            return yield this.onUploadAttachment(claimsIdentity, conversationId, attachmentUpload);
        });
    }
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
    onSendToConversation(claimsIdentity, conversationId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`ChannelServiceHandler.onSendToConversation(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onReplyToActivity(claimsIdentity, conversationId, activityId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onReplyToActivity(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onUpdateActivity(claimsIdentity, conversationId, activityId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onUpdateActivity(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onDeleteActivity(claimsIdentity, conversationId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onDeleteActivity(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onGetActivityMembers(claimsIdentity, conversationId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onGetActivityMembers(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onCreateConversation(claimsIdentity, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onCreateConversation(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onGetConversations(claimsIdentity, conversationId, continuationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onGetConversations(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onGetConversationMembers(claimsIdentity, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onGetConversationMembers(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onGetConversationPagedMembers(claimsIdentity, conversationId, pageSize = -1, continuationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onGetConversationPagedMembers(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onDeleteConversationMember(claimsIdentity, conversationId, memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onDeleteConversationMember(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onSendConversationHistory(claimsIdentity, conversationId, transcript) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onSendConversationHistory(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
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
    onUploadAttachment(claimsIdentity, conversationId, attachmentUpload) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED, `ChannelServiceHandler.onUploadAttachment(): ${botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED}: ${http_1.STATUS_CODES[botFrameworkAdapter_1.StatusCodes.NOT_IMPLEMENTED]}`);
        });
    }
    authenticate(authHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!authHeader) {
                    const isAuthDisable = this.credentialProvider.isAuthenticationDisabled();
                    if (isAuthDisable) {
                        // In the scenario where Auth is disabled, we still want to have the
                        // IsAuthenticated flag set in the ClaimsIdentity. To do this requires
                        // adding in an empty claim.
                        return new botframework_connector_1.ClaimsIdentity([], false);
                    }
                }
                return yield botframework_connector_1.JwtTokenValidation.validateAuthHeader(authHeader, this.credentialProvider, this.channelService, 'unknown', undefined, this.authConfig);
            }
            catch (err) {
                throw new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.UNAUTHORIZED);
            }
        });
    }
}
exports.ChannelServiceHandler = ChannelServiceHandler;
//# sourceMappingURL=channelServiceHandler.js.map