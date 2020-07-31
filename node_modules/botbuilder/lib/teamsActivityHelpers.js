"use strict";
/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Activity helper methods for Teams.
 */
function teamsGetChannelId(activity) {
    if (!activity) {
        throw new Error('Missing activity parameter');
    }
    const channelData = activity.channelData;
    const channel = channelData ? channelData.channel : null;
    return channel && channel.id ? channel.id : null;
}
exports.teamsGetChannelId = teamsGetChannelId;
function teamsGetTeamId(activity) {
    if (!activity) {
        throw new Error('Missing activity parameter');
    }
    const channelData = activity.channelData;
    const team = channelData ? channelData.team : null;
    return team && team.id ? team.id : null;
}
exports.teamsGetTeamId = teamsGetTeamId;
function teamsNotifyUser(activity) {
    if (!activity) {
        throw new Error('Missing activity parameter');
    }
    if (!activity.channelData || typeof activity.channelData !== 'object') {
        activity.channelData = {};
    }
    const channelData = activity.channelData;
    channelData.notification = { alert: true };
}
exports.teamsNotifyUser = teamsNotifyUser;
//# sourceMappingURL=teamsActivityHelpers.js.map