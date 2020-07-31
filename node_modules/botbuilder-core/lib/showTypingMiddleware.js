"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const botframework_schema_1 = require("botframework-schema");
const turnContext_1 = require("./turnContext");
/**
  * Middleware that will send a typing indicator automatically for each message.
  *
  * @remarks
  * When added, this middleware will send typing activities back to the user when a Message activity
  * is received to let them know that the bot has received the message and is working on the response.
  * You can specify a delay in milliseconds before the first typing activity is sent and then a frequency,
  * also in milliseconds which determines how often another typing activity is sent. Typing activities
  * will continue to be sent until your bot sends another message back to the user
  */
class ShowTypingMiddleware {
    /**
         * Create the SendTypingIndicator middleware
         * @param delay {number} Number of milliseconds to wait before sending the first typing indicator.
         * @param period {number} Number of milliseconds to wait before sending each following indicator.
         */
    constructor(delay = 500, period = 2000) {
        if (delay < 0) {
            throw new Error('Delay must be greater than or equal to zero');
        }
        if (period <= 0) {
            throw new Error('Repeat period must be greater than zero');
        }
        this.delay = delay;
        this.period = period;
    }
    /** Implement middleware signature
         * @param context {TurnContext} An incoming TurnContext object.
         * @param next {function} The next delegate function.
         */
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let finished = false;
            let hTimeout = undefined;
            /**
                 * @param context TurnContext object representing incoming message.
                 * @param delay The initial delay before sending the first indicator.
                 * @param period How often to send the indicator after the first.
                 */
            function startInterval(context, delay, period) {
                hTimeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    if (!finished) {
                        let typingActivity = {
                            type: botframework_schema_1.ActivityTypes.Typing,
                            relatesTo: context.activity.relatesTo
                        };
                        // Sending the Activity directly via the Adapter avoids other middleware and avoids setting the
                        // responded flag. However this also requires that the conversation reference details are explicitly added.
                        const conversationReference = turnContext_1.TurnContext.getConversationReference(context.activity);
                        typingActivity = turnContext_1.TurnContext.applyConversationReference(typingActivity, conversationReference);
                        yield context.adapter.sendActivities(context, [typingActivity]);
                        // Pass in period as the delay to repeat at an interval.
                        startInterval(context, period, period);
                    }
                    else {
                        // Do nothing! This turn is done and we don't want to continue sending typing indicators.
                    }
                }), delay);
            }
            function stopInterval() {
                finished = true;
                if (hTimeout) {
                    clearTimeout(hTimeout);
                }
            }
            if (context.activity.type === botframework_schema_1.ActivityTypes.Message) {
                // Set a property to track whether or not the turn is finished.
                // When it flips to true, we won't send anymore typing indicators.
                finished = false;
                startInterval(context, this.delay, this.period);
            }
            // Let the rest of the process run.
            // After everything has run, stop the indicator!
            return yield next().then(stopInterval, stopInterval);
        });
    }
    sendTypingActivity(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let typingActivity = {
                type: botframework_schema_1.ActivityTypes.Typing,
                relatesTo: context.activity.relatesTo
            };
            // Sending the Activity directly via the Adapter avoids other middleware and avoids setting the
            // responded flag. However this also requires that the conversation reference details are explicitly added.
            const conversationReference = turnContext_1.TurnContext.getConversationReference(context.activity);
            typingActivity = turnContext_1.TurnContext.applyConversationReference(typingActivity, conversationReference);
            yield context.adapter.sendActivities(context, [typingActivity]);
        });
    }
}
exports.ShowTypingMiddleware = ShowTypingMiddleware;
//# sourceMappingURL=showTypingMiddleware.js.map