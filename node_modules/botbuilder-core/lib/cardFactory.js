"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const botframework_schema_1 = require("botframework-schema");
/**
 * Provides methods for formatting the various card types a bot can return.
 *
 * @remarks
 * All of these functions return an [Attachment](xref:botframework-schema.Attachment) object,
 * which can be added to an existing activity's [attachments](xref:botframework-schema.Activity.attachments) collection directly or
 * passed as input to one of the [MessageFactory](xref:botbuilder-core.MessageFactory) methods to generate a new activity.
 *
 * This example sends a message that contains a single hero card.
 *
 * ```javascript
 * const { MessageFactory, CardFactory } = require('botbuilder');
 *
 * const card = CardFactory.heroCard(
 *      'White T-Shirt',
 *      ['https://example.com/whiteShirt.jpg'],
 *      ['buy']
 * );
 * const message = MessageFactory.attachment(card);
 * await context.sendActivity(message);
 * ```
 */
class CardFactory {
    /**
     * Returns an attachment for an Adaptive Card.
     *
     * @param card A description of the Adaptive Card to return.
     *
     * @remarks
     * Adaptive Cards are an open card exchange format enabling developers to exchange UI content in a common and consistent way.
     * For channels that don't yet support Adaptive Cards natively, the Bot Framework will
     * down-render the card to an image that's been styled to look good on the target channel. For
     * channels that support [hero cards](#herocards) you can continue to include Adaptive Card
     * actions and they will be sent as buttons along with the rendered version of the card.
     *
     * For more information about Adaptive Cards and to download the latest SDK, visit
     * [adaptivecards.io](http://adaptivecards.io/).
     *
     * For example:
     * ```JavaScript
     * const card = CardFactory.adaptiveCard({
     *   "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
     *   "type": "AdaptiveCard",
     *   "version": "1.0",
     *   "body": [
     *       {
     *          "type": "TextBlock",
     *          "text": "Default text input"
     *       }
     *   ],
     *   "actions": [
     *       {
     *          "type": "Action.Submit",
     *          "title": "OK"
     *       }
     *   ]
     * });
     * ```
     */
    static adaptiveCard(card) {
        return { contentType: CardFactory.contentTypes.adaptiveCard, content: card };
    }
    /**
     * Returns an attachment for an animation card.
     *
     * @param title The card title.
     * @param media The media URLs for the card.
     * @param buttons Optional. The array of buttons to include on the card. Each `string` in the array
     *      is converted to an `imBack` button with a title and value set to the value of the string.
     * @param other Optional. Any additional properties to include on the card.
     */
    static animationCard(title, media, buttons, other) {
        return mediaCard(CardFactory.contentTypes.animationCard, title, media, buttons, other);
    }
    /**
     * Returns an attachment for an audio card.
     *
     * @param title The card title.
     * @param media The media URL for the card.
     * @param buttons Optional. The array of buttons to include on the card. Each `string` in the array
     *      is converted to an `imBack` button with a title and value set to the value of the string.
     * @param other Optional. Any additional properties to include on the card.
     */
    static audioCard(title, media, buttons, other) {
        return mediaCard(CardFactory.contentTypes.audioCard, title, media, buttons, other);
    }
    static heroCard(title, text, images, buttons, other) {
        const a = CardFactory.thumbnailCard(title, text, images, buttons, other);
        a.contentType = CardFactory.contentTypes.heroCard;
        return a;
    }
    /**
     * Returns an attachment for an OAuth card.
     *
     * @param connectionName The name of the OAuth connection to use.
     * @param title The title for the card's sign-in button.
     * @param text Optional. Additional text to include on the card.
     * @param link Optional. The sign-in link to use.
     *
     * @remarks
     * OAuth cards support the Bot Framework's single sign on (SSO) service.
     */
    static oauthCard(connectionName, title, text, link) {
        const card = {
            buttons: [
                { type: botframework_schema_1.ActionTypes.Signin, title: title, value: link, channelData: undefined }
            ],
            connectionName: connectionName
        };
        if (text) {
            card.text = text;
        }
        return { contentType: CardFactory.contentTypes.oauthCard, content: card };
    }
    /**
    * Returns an attachment for an Office 365 connector card.
    *
    * @param card a description of the Office 365 connector card to return.
    *
    * @remarks
    * For example:
    * ```JavaScript
    * const card = CardFactory.o365ConnectorCard({
    *   "title": "card title",
    *   "text": "card text",
    *   "summary": "O365 card summary",
    *   "themeColor": "#E67A9E",
    *   "sections": [
    *       {
    *           "title": "**section title**",
    *           "text": "section text",
    *           "activityTitle": "activity title",
    *       }
    *   ]
    * });
    * ```
    */
    static o365ConnectorCard(card) {
        return { contentType: CardFactory.contentTypes.o365ConnectorCard, content: card };
    }
    /**
     * Returns an attachment for a receipt card.
     *
     * @param card A description of the receipt card to return.
     */
    static receiptCard(card) {
        return { contentType: CardFactory.contentTypes.receiptCard, content: card };
    }
    /**
     * Returns an attachment for a sign-in card.
     *
     * @param title The title for the card's sign-in button.
     * @param url The URL of the sign-in page to use.
     * @param text Optional. Additional text to include on the card.
     *
     * @remarks
     * For channels that don't natively support sign-in cards, an alternative message is rendered.
     */
    static signinCard(title, url, text) {
        const card = { buttons: [{ type: botframework_schema_1.ActionTypes.Signin, title: title, value: url, channelData: undefined }] };
        if (text) {
            card.text = text;
        }
        return { contentType: CardFactory.contentTypes.signinCard, content: card };
    }
    static thumbnailCard(title, text, images, buttons, other) {
        if (typeof text !== 'string') {
            other = buttons;
            buttons = images;
            images = text;
            text = undefined;
        }
        const card = Object.assign({}, other);
        if (title) {
            card.title = title;
        }
        if (text) {
            card.text = text;
        }
        if (images) {
            card.images = CardFactory.images(images);
        }
        if (buttons) {
            card.buttons = CardFactory.actions(buttons);
        }
        return { contentType: CardFactory.contentTypes.thumbnailCard, content: card };
    }
    /**
     * Returns an attachment for a video card.
     *
     * @param title The card title.
     * @param media The media URLs for the card.
     * @param buttons Optional. The array of buttons to include on the card. Each `string` in the array
     *      is converted to an `imBack` button with a title and value set to the value of the string.
     * @param other Optional. Any additional properties to include on the card.
     */
    static videoCard(title, media, buttons, other) {
        return mediaCard(CardFactory.contentTypes.videoCard, title, media, buttons, other);
    }
    /**
     * Returns a properly formatted array of actions.
     *
     * @param actions The array of action to include on the card. Each `string` in the array
     *      is converted to an `imBack` button with a title and value set to the value of the string.
     */
    static actions(actions) {
        const list = [];
        (actions || []).forEach((a) => {
            if (typeof a === 'object') {
                list.push(a);
            }
            else {
                list.push({ type: botframework_schema_1.ActionTypes.ImBack, value: a.toString(), title: a.toString(), channelData: undefined });
            }
        });
        return list;
    }
    /**
     * Returns a properly formatted array of card images.
     *
     * @param images The array of images to include on the card. Each element can be a
     *      [CardImage](ref:botframework-schema.CardImage) or the URL of the image to include.
     */
    static images(images) {
        const list = [];
        (images || []).forEach((img) => {
            if (typeof img === 'object') {
                list.push(img);
            }
            else {
                list.push({ url: img });
            }
        });
        return list;
    }
    /**
     * Returns a properly formatted array of media URL objects.
     *
     * @param links The media URLs. Each `string` is converted to a media URL object.
     */
    static media(links) {
        const list = [];
        (links || []).forEach((lnk) => {
            if (typeof lnk === 'object') {
                list.push(lnk);
            }
            else {
                list.push({ url: lnk });
            }
        });
        return list;
    }
}
/**
 * Lists the content type schema for each card style.
 */
CardFactory.contentTypes = {
    adaptiveCard: 'application/vnd.microsoft.card.adaptive',
    animationCard: 'application/vnd.microsoft.card.animation',
    audioCard: 'application/vnd.microsoft.card.audio',
    heroCard: 'application/vnd.microsoft.card.hero',
    receiptCard: 'application/vnd.microsoft.card.receipt',
    oauthCard: 'application/vnd.microsoft.card.oauth',
    o365ConnectorCard: 'application/vnd.microsoft.teams.card.o365connector',
    signinCard: 'application/vnd.microsoft.card.signin',
    thumbnailCard: 'application/vnd.microsoft.card.thumbnail',
    videoCard: 'application/vnd.microsoft.card.video'
};
exports.CardFactory = CardFactory;
/**
 * @private
 */
function mediaCard(contentType, title, media, buttons, other) {
    const card = Object.assign({}, other);
    if (title) {
        card.title = title;
    }
    card.media = CardFactory.media(media);
    if (buttons) {
        card.buttons = CardFactory.actions(buttons);
    }
    return { contentType: contentType, content: card };
}
//# sourceMappingURL=cardFactory.js.map