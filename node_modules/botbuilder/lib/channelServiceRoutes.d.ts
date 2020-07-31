/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ChannelServiceHandler } from './channelServiceHandler';
import { WebRequest, WebResponse } from './botFrameworkAdapter';
export declare type RouteHandler = (request: WebRequest, response: WebResponse) => void;
/**
 * Interface representing an Express Application or a Restify Server.
 */
export interface WebServer {
    get: (path: string, handler: RouteHandler) => void;
    post: (path: string, handler: RouteHandler) => void;
    put: (path: string, handler: RouteHandler) => void;
    del?: (path: string, handler: RouteHandler) => void;
    delete?: (path: string, handler: RouteHandler) => void;
}
export declare class ChannelServiceRoutes {
    private readonly channelServiceHandler;
    /**
     * @param channelServiceHandler
     */
    constructor(channelServiceHandler: ChannelServiceHandler);
    /**
     * Registers all WebServer
     * @param server WebServer
     * @param basePath Optional basePath which is appended before the service's REST API is configured on the WebServer.
     */
    register(server: WebServer, basePath?: string): void;
    private processSendToConversation;
    private processReplyToActivity;
    private processUpdateActivity;
    private processDeleteActivity;
    private processGetActivityMembers;
    private processCreateConversation;
    private processGetConversations;
    private processGetConversationMembers;
    private processGetConversationPagedMembers;
    private processDeleteConversationMember;
    private processSendConversationHistory;
    private processUploadAttachment;
    private static readActivity;
    private static readBody;
    private static handleError;
}
