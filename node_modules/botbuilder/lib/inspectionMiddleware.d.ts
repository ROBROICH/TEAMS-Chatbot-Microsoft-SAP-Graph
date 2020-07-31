/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { MicrosoftAppCredentials } from 'botframework-connector';
import { Activity, Middleware, TurnContext, BotState, UserState, ConversationState, Storage } from 'botbuilder-core';
/** @private */
declare abstract class InterceptionMiddleware implements Middleware {
    /** Implement middleware signature
     * @param context {TurnContext} An incoming TurnContext object.
     * @param next {function} The next delegate function.
     */
    onTurn(turnContext: TurnContext, next: () => Promise<void>): Promise<void>;
    protected abstract inbound(turnContext: TurnContext, traceActivity: Partial<Activity>): Promise<any>;
    protected abstract outbound(turnContext: TurnContext, traceActivities: Partial<Activity>[]): Promise<any>;
    protected abstract traceState(turnContext: TurnContext): Promise<any>;
    private invokeInbound;
    private invokeOutbound;
    private invokeTraceState;
}
/**
 * InspectionMiddleware for emulator inspection of runtime Activities and BotState.
 *
 * @remarks
 * InspectionMiddleware for emulator inspection of runtime Activities and BotState.
 *
 */
export declare class InspectionMiddleware extends InterceptionMiddleware {
    private static readonly command;
    private readonly inspectionState;
    private readonly inspectionStateAccessor;
    private readonly userState;
    private readonly conversationState;
    private readonly credentials;
    /**
     * Create the Inspection middleware for sending trace activities out to an emulator session
     */
    constructor(inspectionState: InspectionState, userState?: UserState, conversationState?: ConversationState, credentials?: Partial<MicrosoftAppCredentials>);
    processCommand(turnContext: TurnContext): Promise<any>;
    protected inbound(turnContext: TurnContext, traceActivity: Partial<Activity>): Promise<any>;
    protected outbound(turnContext: TurnContext, traceActivities: Partial<Activity>[]): Promise<any>;
    protected traceState(turnContext: TurnContext): Promise<any>;
    private processOpenCommand;
    private processAttachCommand;
    private openCommand;
    private attachCommand;
    private findSession;
    private invokeSend;
    private cleanUpSession;
    private getAttachId;
}
/**
 * InspectionState for use by the InspectionMiddleware for emulator inspection of runtime Activities and BotState.
 *
 * @remarks
 * InspectionState for use by the InspectionMiddleware for emulator inspection of runtime Activities and BotState.
 *
 */
export declare class InspectionState extends BotState {
    constructor(storage: Storage);
    protected getStorageKey(turnContext: TurnContext): string;
}
export {};
