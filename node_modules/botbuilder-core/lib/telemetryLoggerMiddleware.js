"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botTelemetryClient_1 = require("./botTelemetryClient");
const turnContext_1 = require("./turnContext");
const botframework_schema_1 = require("botframework-schema");
const telemetryConstants_1 = require("./telemetryConstants");
/**
 * Middleware for logging incoming, outgoing, updated or deleted Activity messages.
 * Uses the botTelemetryClient interface.
 */
class TelemetryLoggerMiddleware {
    // tslint:enable:variable-name
    /**
     * Initializes a new instance of the TelemetryLoggerMiddleware class.
     * @param telemetryClient The BotTelemetryClient used for logging.
     * @param logPersonalInformation (Optional) Enable/Disable logging original message name within Application Insights.
     */
    constructor(telemetryClient, logPersonalInformation = false) {
        this.telemetryConstants = new telemetryConstants_1.TelemetryConstants();
        this._telemetryClient = telemetryClient || new botTelemetryClient_1.NullTelemetryClient();
        this._logPersonalInformation = logPersonalInformation;
    }
    /**
     * Gets a value indicating whether determines whether to log personal information that came from the user.
     */
    get logPersonalInformation() { return this._logPersonalInformation; }
    /**
     * Gets the currently configured botTelemetryClient that logs the events.
     */
    get telemetryClient() { return this._telemetryClient; }
    /**
     * Logs events based on incoming and outgoing activities using the botTelemetryClient class.
     * @param context The context object for this turn.
     * @param next The delegate to call to continue the bot middleware pipeline
     */
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context === null) {
                throw new Error('context is null');
            }
            // log incoming activity at beginning of turn
            if (context.activity !== null) {
                const activity = context.activity;
                // Log Bot Message Received
                yield this.onReceiveActivity(activity);
            }
            // hook up onSend pipeline
            context.onSendActivities((ctx, activities, nextSend) => __awaiter(this, void 0, void 0, function* () {
                // run full pipeline
                const responses = yield nextSend();
                activities.forEach((act) => __awaiter(this, void 0, void 0, function* () {
                    yield this.onSendActivity(act);
                }));
                return responses;
            }));
            // hook up update activity pipeline
            context.onUpdateActivity((ctx, activity, nextUpdate) => __awaiter(this, void 0, void 0, function* () {
                // run full pipeline
                const response = yield nextUpdate();
                yield this.onUpdateActivity(activity);
                return response;
            }));
            // hook up delete activity pipeline
            context.onDeleteActivity((ctx, reference, nextDelete) => __awaiter(this, void 0, void 0, function* () {
                // run full pipeline
                yield nextDelete();
                const deletedActivity = turnContext_1.TurnContext.applyConversationReference({
                    type: botframework_schema_1.ActivityTypes.MessageDelete,
                    id: reference.activityId
                }, reference, false);
                yield this.onDeleteActivity(deletedActivity);
            }));
            if (next !== null) {
                yield next();
            }
        });
    }
    /**
     * Invoked when a message is received from the user.
     * Performs logging of telemetry data using the IBotTelemetryClient.TrackEvent() method.
     * The event name logged is "BotMessageReceived".
     * @param activity Current activity sent from user.
     */
    onReceiveActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            this.telemetryClient.trackEvent({
                name: TelemetryLoggerMiddleware.botMsgReceiveEvent,
                properties: yield this.fillReceiveEventProperties(activity)
            });
        });
    }
    /**
     * Invoked when the bot sends a message to the user.
     * Performs logging of telemetry data using the botTelemetryClient.trackEvent() method.
     * The event name logged is "BotMessageSend".
     * @param activity Last activity sent from user.
     */
    onSendActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            this.telemetryClient.trackEvent({
                name: TelemetryLoggerMiddleware.botMsgSendEvent,
                properties: yield this.fillSendEventProperties(activity)
            });
        });
    }
    /**
     * Invoked when the bot updates a message.
     * Performs logging of telemetry data using the botTelemetryClient.trackEvent() method.
     * The event name used is "BotMessageUpdate".
     * @param activity
     */
    onUpdateActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            this.telemetryClient.trackEvent({
                name: TelemetryLoggerMiddleware.botMsgUpdateEvent,
                properties: yield this.fillUpdateEventProperties(activity)
            });
        });
    }
    /**
     * Invoked when the bot deletes a message.
     * Performs logging of telemetry data using the botTelemetryClient.trackEvent() method.
     * The event name used is "BotMessageDelete".
     * @param activity
     */
    onDeleteActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            this.telemetryClient.trackEvent({
                name: TelemetryLoggerMiddleware.botMsgDeleteEvent,
                properties: yield this.fillDeleteEventProperties(activity)
            });
        });
    }
    /**
     * Fills the Application Insights Custom Event properties for BotMessageReceived.
     * These properties are logged in the custom event when a new message is received from the user.
     * @param activity Last activity sent from user.
     * @param telemetryProperties Additional properties to add to the event.
     * @returns A dictionary that is sent as "Properties" to botTelemetryClient.trackEvent method.
     */
    fillReceiveEventProperties(activity, telemetryProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = {};
            properties[this.telemetryConstants.fromIdProperty] = activity.from.id || '';
            properties[this.telemetryConstants.conversationNameProperty] = activity.conversation.name || '';
            properties[this.telemetryConstants.localeProperty] = activity.locale || '';
            properties[this.telemetryConstants.recipientIdProperty] = activity.recipient.id;
            properties[this.telemetryConstants.recipientNameProperty] = activity.recipient.name;
            // Use the LogPersonalInformation flag to toggle logging PII data, text and user name are common examples
            if (this.logPersonalInformation) {
                if (activity.from.name && activity.from.name.trim()) {
                    properties[this.telemetryConstants.fromNameProperty] = activity.from.name;
                }
                if (activity.text && activity.text.trim()) {
                    properties[this.telemetryConstants.textProperty] = activity.text;
                }
                if (activity.speak && activity.speak.trim()) {
                    properties[this.telemetryConstants.speakProperty] = activity.speak;
                }
            }
            // Additional Properties can override "stock" properties.
            if (telemetryProperties) {
                return Object.assign({}, properties, telemetryProperties);
            }
            return properties;
        });
    }
    /**
     * Fills the Application Insights Custom Event properties for BotMessageSend.
     * These properties are logged in the custom event when a response message is sent by the Bot to the user.
     * @param activity - Last activity sent from user.
     * @param telemetryProperties Additional properties to add to the event.
     * @returns A dictionary that is sent as "Properties" to botTelemetryClient.trackEvent method.
     */
    fillSendEventProperties(activity, telemetryProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = {};
            properties[this.telemetryConstants.replyActivityIdProperty] = activity.replyToId || '';
            properties[this.telemetryConstants.recipientIdProperty] = activity.recipient.id;
            properties[this.telemetryConstants.conversationNameProperty] = activity.conversation.name;
            properties[this.telemetryConstants.localeProperty] = activity.locale || '';
            // Use the LogPersonalInformation flag to toggle logging PII data, text and user name are common examples
            if (this.logPersonalInformation) {
                if (activity.recipient.name && activity.recipient.name.trim()) {
                    properties[this.telemetryConstants.recipientNameProperty] = activity.recipient.name;
                }
                if (activity.text && activity.text.trim()) {
                    properties[this.telemetryConstants.textProperty] = activity.text;
                }
                if (activity.speak && activity.speak.trim()) {
                    properties[this.telemetryConstants.speakProperty] = activity.speak;
                }
            }
            // Additional Properties can override "stock" properties.
            if (telemetryProperties) {
                return Object.assign({}, properties, telemetryProperties);
            }
            return properties;
        });
    }
    /**
     * Fills the event properties for BotMessageUpdate.
     * These properties are logged when an activity message is updated by the Bot.
     * For example, if a card is interacted with by the use, and the card needs to be updated to reflect
     * some interaction.
     * @param activity - Last activity sent from user.
     * @param telemetryProperties Additional properties to add to the event.
     * @returns A dictionary that is sent as "Properties" to botTelemetryClient.trackEvent method.
     */
    fillUpdateEventProperties(activity, telemetryProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = {};
            properties[this.telemetryConstants.recipientIdProperty] = activity.recipient.id;
            properties[this.telemetryConstants.conversationIdProperty] = activity.conversation.id;
            properties[this.telemetryConstants.conversationNameProperty] = activity.conversation.name;
            properties[this.telemetryConstants.localeProperty] = activity.locale || '';
            // Use the LogPersonalInformation flag to toggle logging PII data, text is a common example
            if (this.logPersonalInformation && activity.text && activity.text.trim()) {
                properties[this.telemetryConstants.textProperty] = activity.text;
            }
            // Additional Properties can override "stock" properties.
            if (telemetryProperties) {
                return Object.assign({}, properties, telemetryProperties);
            }
            return properties;
        });
    }
    /**
     * Fills the Application Insights Custom Event properties for BotMessageDelete.
     * These properties are logged in the custom event when an activity message is deleted by the Bot.  This is a relatively rare case.
     * @param activity - Last activity sent from user.
     * @param telemetryProperties Additional properties to add to the event.
     * @returns A dictionary that is sent as "Properties" to botTelemetryClient.trackEvent method.
     */
    fillDeleteEventProperties(activity, telemetryProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = {};
            properties[this.telemetryConstants.channelIdProperty] = activity.channelId;
            properties[this.telemetryConstants.recipientIdProperty] = activity.recipient.id;
            properties[this.telemetryConstants.conversationIdProperty] = activity.conversation.id;
            properties[this.telemetryConstants.conversationNameProperty] = activity.conversation.name;
            // Additional Properties can override "stock" properties.
            if (telemetryProperties) {
                return Object.assign({}, properties, telemetryProperties);
            }
            return properties;
        });
    }
}
/**
 * The name of the event when when new message is received from the user.
 */
TelemetryLoggerMiddleware.botMsgReceiveEvent = 'BotMessageReceived';
/**
 * The name of the event when a message is updated by the bot.
 */
TelemetryLoggerMiddleware.botMsgSendEvent = 'BotMessageSend';
/**
 * The name of the event when a message is updated by the bot.
 */
TelemetryLoggerMiddleware.botMsgUpdateEvent = 'BotMessageUpdate';
/**
 * The name of the event when a message is deleted by the bot.
 */
TelemetryLoggerMiddleware.botMsgDeleteEvent = 'BotMessageDelete';
exports.TelemetryLoggerMiddleware = TelemetryLoggerMiddleware;
//# sourceMappingURL=telemetryLoggerMiddleware.js.map