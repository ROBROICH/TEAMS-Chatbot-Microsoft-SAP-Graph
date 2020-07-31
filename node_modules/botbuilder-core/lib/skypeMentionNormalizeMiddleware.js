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
 * Middleware to patch mention Entities from Skype since they don't conform to expected values.
 * Bots that interact with Skype should use this middleware if mentions are used.
 *
 * @remarks
 * A Skype mention "text" field is of the format:
 *   <at id="28:2bc5b54d-5d48-4ff1-bd25-03dcbb5ce918">botname</at>
 * But Activity.Text doesn't contain those tags and RemoveMentionText can't remove
 * the entity from Activity.Text.
 * This will remove the <at> nodes, leaving just the name.
 */
class SkypeMentionNormalizeMiddleware {
    static normalizeSkypeMentionText(activity) {
        if (activity.channelId === 'skype' && activity.type === 'message') {
            activity.entities.map((element) => {
                if (element.type === 'mention') {
                    const text = element['text'];
                    const end = text.indexOf('>');
                    if (end > -1) {
                        const start = text.indexOf('<', end);
                        if (start > -1)
                            element['text'] = text.substring(end + 1, start);
                    }
                }
            });
        }
    }
    onTurn(turnContext, next) {
        return __awaiter(this, void 0, void 0, function* () {
            SkypeMentionNormalizeMiddleware.normalizeSkypeMentionText(turnContext.activity);
            yield next();
        });
    }
}
exports.SkypeMentionNormalizeMiddleware = SkypeMentionNormalizeMiddleware;
//# sourceMappingURL=skypeMentionNormalizeMiddleware.js.map