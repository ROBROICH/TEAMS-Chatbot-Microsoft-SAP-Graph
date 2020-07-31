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
const botframework_connector_1 = require("botframework-connector");
class TeamsInfo {
    static getTeamDetails(context, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = teamId || this.getTeamId(context);
            if (!t) {
                throw new Error('This method is only valid within the scope of a MS Teams Team.');
            }
            return yield this.getTeamsConnectorClient(context).teams.fetchTeamDetails(t);
        });
    }
    static getTeamChannels(context, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = teamId || this.getTeamId(context);
            if (!t) {
                throw new Error('This method is only valid within the scope of a MS Teams Team.');
            }
            const channelList = yield this.getTeamsConnectorClient(context).teams.fetchChannelList(t);
            return channelList.conversations;
        });
    }
    static getMembers(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamId = this.getTeamId(context);
            if (teamId) {
                return yield this.getTeamMembers(context, teamId);
            }
            else {
                const conversation = context.activity.conversation;
                const conversationId = conversation && conversation.id ? conversation.id : undefined;
                return yield this.getMembersInternal(this.getConnectorClient(context), conversationId);
            }
        });
    }
    static getTeamMembers(context, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = teamId || this.getTeamId(context);
            if (!t) {
                throw new Error('This method is only valid within the scope of a MS Teams Team.');
            }
            return this.getMembersInternal(this.getConnectorClient(context), t);
        });
    }
    static getMembersInternal(connectorClient, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!conversationId) {
                throw new Error('The getMembers operation needs a valid conversationId.');
            }
            const teamMembers = yield connectorClient.conversations.getConversationMembers(conversationId);
            teamMembers.forEach((member) => {
                member.aadObjectId = member.objectId;
            });
            return teamMembers;
        });
    }
    static getTeamId(context) {
        if (!context) {
            throw new Error('Missing context parameter');
        }
        if (!context.activity) {
            throw new Error('Missing activity on context');
        }
        const channelData = context.activity.channelData;
        const team = channelData && channelData.team ? channelData.team : undefined;
        const teamId = team && typeof (team.id) === 'string' ? team.id : undefined;
        return teamId;
    }
    static getConnectorClient(context) {
        if (!context.adapter || !('createConnectorClient' in context.adapter)) {
            throw new Error('This method requires a connector client.');
        }
        return context.adapter.createConnectorClient(context.activity.serviceUrl);
    }
    static getTeamsConnectorClient(context) {
        const connectorClient = this.getConnectorClient(context);
        return new botframework_connector_1.TeamsConnectorClient(connectorClient.credentials, { baseUri: context.activity.serviceUrl });
    }
}
exports.TeamsInfo = TeamsInfo;
//# sourceMappingURL=teamsInfo.js.map