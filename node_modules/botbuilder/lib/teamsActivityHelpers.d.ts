/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity } from 'botbuilder-core';
/**
 * Activity helper methods for Teams.
 */
export declare function teamsGetChannelId(activity: Activity): string;
export declare function teamsGetTeamId(activity: Activity): string;
export declare function teamsNotifyUser(activity: Activity): void;
