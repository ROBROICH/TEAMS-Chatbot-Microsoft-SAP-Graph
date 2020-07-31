/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { InvokeResponse } from './botFrameworkAdapter';
import { ActivityHandler, AppBasedLinkQuery, ChannelInfo, FileConsentCardResponse, MessagingExtensionAction, MessagingExtensionActionResponse, MessagingExtensionQuery, MessagingExtensionResponse, O365ConnectorCardActionQuery, SigninStateVerificationQuery, TaskModuleRequest, TaskModuleResponse, TeamsChannelAccount, TeamInfo, TurnContext } from 'botbuilder-core';
export declare class TeamsActivityHandler extends ActivityHandler {
    /**
     *
     * @param context
     */
    protected onTurnActivity(context: TurnContext): Promise<void>;
    /**
     *
     * @param context
     */
    protected onInvokeActivity(context: TurnContext): Promise<InvokeResponse>;
    /**
     *
     * @param context
     */
    protected handleTeamsCardActionInvoke(context: TurnContext): Promise<InvokeResponse>;
    /**
     * Receives invoke activities with Activity name of 'fileConsent/invoke'. Handlers registered here run before
     * `handleTeamsFileConsentAccept` and `handleTeamsFileConsentDecline`.
     * Developers are not passed a pointer to the next `handleTeamsFileConsent` handler because the _wrapper_ around
     * the handler will call `onDialogs` handlers after delegating to `handleTeamsFileConsentAccept` or `handleTeamsFileConsentDecline`.
     * @param context
     * @param fileConsentCardResponse
     */
    protected handleTeamsFileConsent(context: TurnContext, fileConsentCardResponse: FileConsentCardResponse): Promise<void>;
    /**
     * Receives invoke activities with Activity name of 'fileConsent/invoke' with confirmation from user
     * @remarks
     * This type of invoke activity occur during the File Consent flow.
     * @param context
     * @param fileConsentCardResponse
     */
    protected handleTeamsFileConsentAccept(context: TurnContext, fileConsentCardResponse: FileConsentCardResponse): Promise<void>;
    /**
     * Receives invoke activities with Activity name of 'fileConsent/invoke' with decline from user
     * @remarks
     * This type of invoke activity occur during the File Consent flow.
     * @param context
     * @param fileConsentCardResponse
     */
    protected handleTeamsFileConsentDecline(context: TurnContext, fileConsentCardResponse: FileConsentCardResponse): Promise<void>;
    /**
     * Receives invoke activities with Activity name of 'actionableMessage/executeAction'
     */
    protected handleTeamsO365ConnectorCardAction(context: TurnContext, query: O365ConnectorCardActionQuery): Promise<void>;
    /**
     * Receives invoke activities with Activity name of 'signin/verifyState'
     * @param context
     * @param action
     */
    protected handleTeamsSigninVerifyState(context: TurnContext, query: SigninStateVerificationQuery): Promise<void>;
    /**
     * Receives invoke activities with Activity name of 'composeExtension/onCardButtonClicked'
     * @param context
     * @param cardData
     */
    protected handleTeamsMessagingExtensionCardButtonClicked(context: TurnContext, cardData: any): Promise<void>;
    /**
     * Receives invoke activities with Activity name of 'task/fetch'
     * @param context
     * @param taskModuleRequest
     */
    protected handleTeamsTaskModuleFetch(context: TurnContext, taskModuleRequest: TaskModuleRequest): Promise<TaskModuleResponse>;
    /**
     * Receives invoke activities with Activity name of 'task/submit'
     * @param context
     * @param taskModuleRequest
     */
    protected handleTeamsTaskModuleSubmit(context: TurnContext, taskModuleRequest: TaskModuleRequest): Promise<TaskModuleResponse>;
    /**
     * Receives invoke activities with Activity name of 'composeExtension/queryLink'
     * @remarks
     * Used in creating a Search-based Message Extension.
     * @param context
     * @param query
     */
    protected handleTeamsAppBasedLinkQuery(context: TurnContext, query: AppBasedLinkQuery): Promise<MessagingExtensionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/query'.
     * @remarks
     * Used in creating a Search-based Message Extension.
     * @param context
     * @param action
     */
    protected handleTeamsMessagingExtensionQuery(context: TurnContext, query: MessagingExtensionQuery): Promise<MessagingExtensionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/selectItem'.
     * @remarks
     * Used in creating a Search-based Message Extension.
     * @param context
     * @param action
     */
    protected handleTeamsMessagingExtensionSelectItem(context: TurnContext, query: any): Promise<MessagingExtensionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/submitAction' and dispatches to botMessagePreview-flows as applicable.
     * @remarks
     * A handler registered through this method does not dispatch to the next handler (either `handleTeamsMessagingExtensionSubmitAction`, `handleTeamsMessagingExtensionBotMessagePreviewEdit`, or `handleTeamsMessagingExtensionBotMessagePreviewSend`).
     * This method exists for developers to optionally add more logic before the TeamsActivityHandler routes the activity to one of the
     * previously mentioned handlers.
     * @param context
     * @param action
     */
    protected handleTeamsMessagingExtensionSubmitActionDispatch(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/submitAction'.
     * @remarks
     * This invoke activity is received when a user
     * @param context
     * @param action
     */
    protected handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/submitAction' with the 'botMessagePreview' property present on activity.value.
     * The value for 'botMessagePreview' is 'edit'.
     * @remarks
     * This invoke activity is received when a user
     * @param context
     * @param action
     */
    protected handleTeamsMessagingExtensionBotMessagePreviewEdit(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/submitAction' with the 'botMessagePreview' property present on activity.value.
     * The value for 'botMessagePreview' is 'send'.
     * @remarks
     * This invoke activity is received when a user
     * @param context
     * @param action
     */
    protected handleTeamsMessagingExtensionBotMessagePreviewSend(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/fetchTask'
     * @param context
     * @param action
     */
    protected handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/querySettingUrl'
     * @param context
     * @param query
     */
    protected handleTeamsMessagingExtensionConfigurationQuerySettingUrl(context: TurnContext, query: MessagingExtensionQuery): Promise<MessagingExtensionResponse>;
    /**
     * Receives invoke activities with the name 'composeExtension/setting'
     * @param context
     * @param query
     */
    protected handleTeamsMessagingExtensionConfigurationSetting(context: TurnContext, settings: any): Promise<void>;
    /**
     * Override this method to change the dispatching of ConversationUpdate activities.
     * @remarks
     *
     * @param context
     */
    protected dispatchConversationUpdateActivity(context: TurnContext): Promise<void>;
    /**
     * Called in `dispatchConversationUpdateActivity()` to trigger the `'TeamsMembersAdded'` handlers.
     * @remarks
     * If no handlers are registered for the `'TeamsMembersAdded'` event, the `'MembersAdded'` handlers will run instead.
     * @param context
     */
    protected onTeamsMembersAdded(context: TurnContext): Promise<void>;
    /**
     * Called in `dispatchConversationUpdateActivity()` to trigger the `'TeamsMembersRemoved'` handlers.
     * @remarks
     * If no handlers are registered for the `'TeamsMembersRemoved'` event, the `'MembersRemoved'` handlers will run instead.
     * @param context
     */
    protected onTeamsMembersRemoved(context: TurnContext): Promise<void>;
    /**
     *
     * @param context
     */
    protected onTeamsChannelCreated(context: any): Promise<void>;
    /**
     *
     * @param context
     */
    protected onTeamsChannelDeleted(context: any): Promise<void>;
    /**
     *
     * @param context
     */
    protected onTeamsChannelRenamed(context: any): Promise<void>;
    /**
     *
     * @param context
     */
    protected onTeamsTeamRenamed(context: any): Promise<void>;
    /**
     *
     * @param handler
     */
    onTeamsMembersAddedEvent(handler: (membersAdded: TeamsChannelAccount[], teamInfo: TeamInfo, context: TurnContext, next: () => Promise<void>) => Promise<void>): this;
    /**
     *
     * @param handler
     */
    onTeamsMembersRemovedEvent(handler: (membersRemoved: TeamsChannelAccount[], teamInfo: TeamInfo, context: TurnContext, next: () => Promise<void>) => Promise<void>): this;
    /**
     *
     * @param handler
     */
    onTeamsChannelCreatedEvent(handler: (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next: () => Promise<void>) => Promise<void>): this;
    /**
     *
     * @param handler
     */
    onTeamsChannelDeletedEvent(handler: (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next: () => Promise<void>) => Promise<void>): this;
    /**
     *
     * @param handler
     */
    onTeamsChannelRenamedEvent(handler: (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next: () => Promise<void>) => Promise<void>): this;
    /**
     *
     * @param handler
     */
    onTeamsTeamRenamedEvent(handler: (teamInfo: TeamInfo, context: TurnContext, next: () => Promise<void>) => Promise<void>): this;
    private static createInvokeResponse;
}
