"use strict";
/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const botFrameworkAdapter_1 = require("./botFrameworkAdapter");
class ChannelServiceRoutes {
    /**
     * @param channelServiceHandler
     */
    constructor(channelServiceHandler) {
        this.channelServiceHandler = channelServiceHandler;
        this.channelServiceHandler = channelServiceHandler;
    }
    /**
     * Registers all WebServer
     * @param server WebServer
     * @param basePath Optional basePath which is appended before the service's REST API is configured on the WebServer.
     */
    register(server, basePath = '') {
        server.post(basePath + '/v3/conversations/:conversationId/activities', this.processSendToConversation.bind(this));
        server.post(basePath + '/v3/conversations/:conversationId/activities/:activityId', this.processReplyToActivity.bind(this));
        server.put(basePath + '/v3/conversations/:conversationId/activities/:activityId', this.processUpdateActivity.bind(this));
        server.get(basePath + '/v3/conversations/:conversationId/activities/:activityId/members', this.processGetActivityMembers.bind(this));
        server.post(basePath + '/v3/conversations', this.processCreateConversation.bind(this));
        server.get(basePath + '/v3/conversations', this.processGetConversations.bind(this));
        server.get(basePath + '/v3/conversations/:conversationId/members', this.processGetConversationMembers.bind(this));
        server.get(basePath + '/v3/conversations/:conversationId/pagedmembers', this.processGetConversationPagedMembers.bind(this));
        server.post(basePath + '/v3/conversations/:conversationId/activities/history', this.processSendConversationHistory.bind(this));
        server.post(basePath + '/v3/conversations/:conversationId/attachments', this.processUploadAttachment.bind(this));
        server.del(basePath + '/v3/conversations/:conversationId/members/:memberId', this.processDeleteConversationMember.bind(this));
        server.del(basePath + '/v3/conversations/:conversationId/activities/:activityId', this.processDeleteActivity.bind(this));
    }
    processSendToConversation(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceRoutes.readActivity(req)
            .then((activity) => {
            this.channelServiceHandler.handleSendToConversation(authHeader, req.params.conversationId, activity)
                .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            })
                .catch(err => { ChannelServiceRoutes.handleError(err, res); });
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processReplyToActivity(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceRoutes.readActivity(req)
            .then((activity) => {
            this.channelServiceHandler.handleReplyToActivity(authHeader, req.params.conversationId, req.params.activityId, activity)
                .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            })
                .catch(err => { ChannelServiceRoutes.handleError(err, res); });
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processUpdateActivity(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceRoutes.readActivity(req)
            .then((activity) => {
            this.channelServiceHandler.handleUpdateActivity(authHeader, req.params.conversationId, req.params.activityId, activity)
                .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            })
                .catch(err => { ChannelServiceRoutes.handleError(err, res); });
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processDeleteActivity(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleDeleteActivity(authHeader, req.params.conversationId, req.params.activityId)
            .then(() => {
            res.status(200);
            res.end();
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processGetActivityMembers(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleGetActivityMembers(authHeader, req.params.conversationId, req.params.activityId)
            .then((channelAccounts) => {
            if (channelAccounts) {
                res.send(channelAccounts);
            }
            res.status(200);
            res.end();
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processCreateConversation(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceRoutes.readBody(req)
            .then((conversationParameters) => {
            this.channelServiceHandler.handleCreateConversation(authHeader, conversationParameters)
                .then((conversationResourceResponse) => {
                if (conversationResourceResponse) {
                    res.send(conversationResourceResponse);
                }
                res.status(201);
                res.end();
            })
                .catch(err => { ChannelServiceRoutes.handleError(err, res); });
        });
    }
    processGetConversations(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleGetConversations(authHeader, req.params.conversationId, req.query.continuationToken)
            .then((conversationsResult) => {
            if (conversationsResult) {
                res.send(conversationsResult);
            }
            res.status(200);
            res.end();
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processGetConversationMembers(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleGetConversationMembers(authHeader, req.params.conversationId)
            .then((channelAccounts) => {
            res.status(200);
            if (channelAccounts) {
                res.send(channelAccounts);
            }
            res.end();
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processGetConversationPagedMembers(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageSize)) {
            pageSize = undefined;
        }
        this.channelServiceHandler.handleGetConversationPagedMembers(authHeader, req.params.conversationId, pageSize, req.query.continuationToken)
            .then((pagedMembersResult) => {
            res.status(200);
            if (pagedMembersResult) {
                res.send(pagedMembersResult);
            }
            res.end();
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processDeleteConversationMember(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleDeleteConversationMember(authHeader, req.params.conversationId, req.params.memberId)
            .then((resourceResponse) => {
            res.status(200);
            res.end();
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processSendConversationHistory(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceRoutes.readBody(req)
            .then((transcript) => {
            this.channelServiceHandler.handleSendConversationHistory(authHeader, req.params.conversationId, transcript)
                .then((resourceResponse) => {
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.status(200);
                res.end();
            })
                .catch(err => { ChannelServiceRoutes.handleError(err, res); });
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    processUploadAttachment(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceRoutes.readBody(req)
            .then((attachmentData) => {
            this.channelServiceHandler.handleUploadAttachment(authHeader, req.params.conversationId, attachmentData)
                .then((resourceResponse) => {
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.status(200);
                res.end();
            })
                .catch(err => { ChannelServiceRoutes.handleError(err, res); });
        })
            .catch(err => { ChannelServiceRoutes.handleError(err, res); });
    }
    static readActivity(req) {
        return new Promise((resolve, reject) => {
            function returnActivity(activity) {
                if (typeof activity !== 'object') {
                    throw new Error(`Invalid request body.`);
                }
                if (typeof activity.type !== 'string') {
                    throw new Error(`Missing activity type.`);
                }
                if (typeof activity.timestamp === 'string') {
                    activity.timestamp = new Date(activity.timestamp);
                }
                if (typeof activity.localTimestamp === 'string') {
                    activity.localTimestamp = new Date(activity.localTimestamp);
                }
                if (typeof activity.expiration === 'string') {
                    activity.expiration = new Date(activity.expiration);
                }
                resolve(activity);
            }
            if (req.body) {
                try {
                    returnActivity(req.body);
                }
                catch (err) {
                    reject(new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.BAD_REQUEST, err.message));
                }
            }
            else {
                let requestData = '';
                req.on('data', (chunk) => {
                    requestData += chunk;
                });
                req.on('end', () => {
                    try {
                        const body = JSON.parse(requestData);
                        returnActivity(body);
                    }
                    catch (err) {
                        reject(new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.BAD_REQUEST, err.message));
                    }
                });
            }
        });
    }
    static readBody(req) {
        return new Promise((resolve, reject) => {
            if (req.body) {
                try {
                    resolve(req.body);
                }
                catch (err) {
                    reject(new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.BAD_REQUEST, err.message));
                }
            }
            else {
                let requestData = '';
                req.on('data', (chunk) => {
                    requestData += chunk;
                });
                req.on('end', () => {
                    try {
                        const body = JSON.parse(requestData);
                        resolve(body);
                    }
                    catch (err) {
                        reject(new botFrameworkAdapter_1.StatusCodeError(botFrameworkAdapter_1.StatusCodes.BAD_REQUEST, err.message));
                    }
                });
            }
        });
    }
    static handleError(err, res) {
        if (err instanceof botFrameworkAdapter_1.StatusCodeError) {
            res.send(err.message);
            res.status(err.statusCode);
        }
        else {
            res.status(500);
        }
        res.end();
    }
}
exports.ChannelServiceRoutes = ChannelServiceRoutes;
//# sourceMappingURL=channelServiceRoutes.js.map