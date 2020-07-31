"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
const middlewareSet_1 = require("./middlewareSet");
/**
 * Defines the core behavior of a bot adapter that can connect a bot to a service endpoint.
 *
 * @remarks
 * The bot adapter encapsulates authentication processes and sends activities to and receives
 * activities from the Bot Connector Service. When your bot receives an activity, the adapter
 * creates a turn context object, passes it to your bot application logic, and sends responses
 * back to the user's channel.
 *
 * The adapter processes and directs incoming activities in through the bot middleware pipeline to
 * your bot logic and then back out again. As each activity flows in and out of the bot, each
 * piece of middleware can inspect or act upon the activity, both before and after the bot logic runs.
 * Use the [use](xref:botbuilder-core.BotAdapter.use) method to add [Middleware](xref:botbuilder-core.Middleware)
 * objects to your adapter's middleware collection.
 *
 * For more information, see the articles on
 * [How bots work](https://docs.microsoft.com/azure/bot-service/bot-builder-basics) and
 * [Middleware](https://docs.microsoft.com/azure/bot-service/bot-builder-concept-middleware).
 */
class BotAdapter {
    constructor() {
        this.middleware = new middlewareSet_1.MiddlewareSet();
    }
    /**
     * Gets or sets an error handler that can catch exceptions in the middleware or application.
     *
     * @remarks
     * The error handler is called with these parameters:
     *
     * | Name | Type | Description |
     * | :--- | :--- | :--- |
     * | `context` | [TurnContext](xref:botbuilder-core.TurnContext) | The context object for the turn. |
     * | `error` | `Error` | The Node.js error thrown. |
     */
    get onTurnError() {
        return this.turnError;
    }
    set onTurnError(value) {
        this.turnError = value;
    }
    /**
     * Adds middleware to the adapter's pipeline.
     *
     * @param middleware The middleware or middleware handlers to add.
     *
     * @remarks
     * Middleware is added to the adapter at initialization time.
     * Each turn, the adapter calls its middleware in the order in which you added it.
     */
    use(...middleware) {
        middlewareSet_1.MiddlewareSet.prototype.use.apply(this.middleware, middleware);
        return this;
    }
    /**
     * Starts activity processing for the current bot turn.
     *
     * @param context The context object for the turn.
     * @param next A callback method to run at the end of the pipeline.
     *
     * @remarks
     * The adapter creates a revokable proxy for the turn context and then calls its middleware in
     * the order in which you added it. If the middleware chain completes without short circuiting,
     * the adapter calls the callback method. If any middleware short circuits, the adapter does not
     * call any of the subsequent middleware or the callback method, and the pipeline short circuits.
     *
     * The adapter calls middleware with a `next` parameter, which represents the next step in the
     * pipeline. Middleware should call the `next` method to continue processing without short circuiting.
     *
     * When the turn is initiated by a user activity (reactive messaging), the callback method will
     * be a reference to the bot's turn handler. When the turn is initiated by a call to
     * [continueConversation](xref:botbuilder-core.BotAdapter.continueConversation) (proactive messaging),
     * the callback method is the callback method that was provided in the call.
     */
    runMiddleware(context, next) {
        // Wrap context with revocable proxy
        const pContext = internal_1.makeRevocable(context);
        return new Promise((resolve, reject) => {
            this.middleware.run(pContext.proxy, () => {
                // Call next with revocable context
                return next(pContext.proxy);
            }).then(resolve, (err) => {
                if (this.onTurnError) {
                    this.onTurnError(pContext.proxy, err)
                        .then(resolve, reject);
                }
                else {
                    reject(err);
                }
            });
        }).then(() => pContext.revoke(), (err) => {
            pContext.revoke();
            throw err;
        });
    }
}
exports.BotAdapter = BotAdapter;
//# sourceMappingURL=botAdapter.js.map