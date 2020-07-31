/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ChannelInfo, TeamsChannelAccount, TeamDetails, TurnContext } from 'botbuilder-core';
export declare class TeamsInfo {
    static getTeamDetails(context: TurnContext, teamId?: string): Promise<TeamDetails>;
    static getTeamChannels(context: TurnContext, teamId?: string): Promise<ChannelInfo[]>;
    static getMembers(context: TurnContext): Promise<TeamsChannelAccount[]>;
    static getTeamMembers(context: TurnContext, teamId?: string): Promise<TeamsChannelAccount[]>;
    private static getMembersInternal;
    private static getTeamId;
    private static getConnectorClient;
    private static getTeamsConnectorClient;
}
