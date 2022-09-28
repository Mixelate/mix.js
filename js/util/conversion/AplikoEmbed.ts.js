"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AplikoBuildEmbeds = exports.AplikoEmbedStyle = exports.AplikoEmbedMaxFooterContentSize = exports.AplikoEmbedMaxFieldContentSize = exports.AplikoEmbedMaxFieldTitleSize = exports.AplikoEmbedMaxFields = exports.AplikoEmbedMaxDescriptionSize = exports.aplikoEmbedMaxTitleSize = exports.AplikoEmbedMaxAuthorNameSize = exports.AplikoEmbedTwoColumnRows = exports.AplikoEmbedErrorColor = exports.AplikoEmbedSuccessColor = exports.AplikoEmbedPrimaryColor = void 0;
const discord_js_1 = require("discord.js");
const Errors_1 = require("../Errors");
/**
 * builder pattern is annoying, let's fix it @discord.js LOL
 */
exports.AplikoEmbedPrimaryColor = '#65a7e6';
exports.AplikoEmbedSuccessColor = '#44ff44';
exports.AplikoEmbedErrorColor = '#ff4444';
exports.AplikoEmbedTwoColumnRows = true;
exports.AplikoEmbedMaxAuthorNameSize = 256;
exports.aplikoEmbedMaxTitleSize = 256;
exports.AplikoEmbedMaxDescriptionSize = 2048;
exports.AplikoEmbedMaxFields = 25;
exports.AplikoEmbedMaxFieldTitleSize = 256;
exports.AplikoEmbedMaxFieldContentSize = 1024;
exports.AplikoEmbedMaxFooterContentSize = 2048;
var AplikoEmbedStyle;
(function (AplikoEmbedStyle) {
    AplikoEmbedStyle[AplikoEmbedStyle["PRIMARY"] = 1] = "PRIMARY";
    AplikoEmbedStyle[AplikoEmbedStyle["SUCCESS"] = 2] = "SUCCESS";
    AplikoEmbedStyle[AplikoEmbedStyle["ERROR"] = 3] = "ERROR";
    AplikoEmbedStyle[AplikoEmbedStyle["CUSTOM"] = 4] = "CUSTOM";
})(AplikoEmbedStyle = exports.AplikoEmbedStyle || (exports.AplikoEmbedStyle = {}));
function AplikoBuildEmbeds(client, ...aplikoEmbeds) {
    const messageEmbeds = [];
    for (const aplikoEmbed of aplikoEmbeds) {
        const messageEmbed = new discord_js_1.MessageEmbed();
        // Set embed color based on style
        switch (aplikoEmbed.style) {
            case AplikoEmbedStyle.SUCCESS: {
                messageEmbed.setColor(exports.AplikoEmbedSuccessColor);
                break;
            }
            case AplikoEmbedStyle.ERROR: {
                messageEmbed.setColor(exports.AplikoEmbedErrorColor);
                break;
            }
            case AplikoEmbedStyle.CUSTOM: {
                messageEmbed.setColor(aplikoEmbed.customStyle ? aplikoEmbed.customStyle : exports.AplikoEmbedPrimaryColor);
                break;
            }
            default: {
                if (client.options.apprearance?.embedPrimaryColor)
                    messageEmbed.setColor(client.options.apprearance.embedPrimaryColor);
                else
                    messageEmbed.setColor(exports.AplikoEmbedPrimaryColor);
            }
        }
        // Set author
        if (aplikoEmbed.author) {
            if (aplikoEmbed.author.name.length > exports.AplikoEmbedMaxAuthorNameSize)
                (0, Errors_1.ThrowError)('Embed author name is too long');
            messageEmbed.setAuthor({
                name: aplikoEmbed.author.name,
                iconURL: aplikoEmbed.author.imageUrl,
                url: aplikoEmbed.author.url
            });
        }
        // Set title
        if (aplikoEmbed.title) {
            if (aplikoEmbed.title.length > exports.aplikoEmbedMaxTitleSize)
                (0, Errors_1.ThrowError)('Embed title is too long');
            messageEmbed.setTitle(aplikoEmbed.title);
        }
        // Set description
        if (aplikoEmbed.description) {
            if (aplikoEmbed.description.length > exports.AplikoEmbedMaxDescriptionSize)
                (0, Errors_1.ThrowError)('Embed description is too long');
            messageEmbed.setDescription(aplikoEmbed.description);
        }
        // Set footer
        if (aplikoEmbed.footer) {
            if (aplikoEmbed.footer.content.length > exports.AplikoEmbedMaxFooterContentSize)
                (0, Errors_1.ThrowError)('Embed footer is too long');
            messageEmbed.setFooter({
                text: aplikoEmbed.footer.content,
                iconURL: aplikoEmbed.footer.imageUrl
            });
        }
        // Set thumbnail
        if (aplikoEmbed.thumbnail)
            messageEmbed.thumbnail = isMessageEmbedThumbnail(aplikoEmbed.thumbnail) ? aplikoEmbed.thumbnail : { url: aplikoEmbed.thumbnail };
        // Add fields
        if (aplikoEmbed.fields && aplikoEmbed.fields.length > 0) {
            if (aplikoEmbed.fields.length > exports.AplikoEmbedMaxFields)
                (0, Errors_1.ThrowError)('Embed has too many fields');
            for (const aplikoEmbedField of aplikoEmbed.fields) {
                if (aplikoEmbedField.title.length > exports.AplikoEmbedMaxFieldTitleSize)
                    (0, Errors_1.ThrowError)('Embed field title is too long');
                if (aplikoEmbedField.content && aplikoEmbedField.content.length > exports.AplikoEmbedMaxFieldContentSize)
                    (0, Errors_1.ThrowError)('Embged field content is too long');
                messageEmbed.addField(aplikoEmbedField.title, aplikoEmbedField.content, aplikoEmbedField.inline ? aplikoEmbedField.inline : false);
                if (exports.AplikoEmbedTwoColumnRows && aplikoEmbedField.inline && ((messageEmbed.fields.length - 1) % 3 === 0 || messageEmbed.fields.length === 1))
                    messageEmbed.addField('\u200b', // Invis space
                    '\u200b', // Invis space
                    true);
            }
        }
        messageEmbeds.push(messageEmbed);
    }
    return messageEmbeds;
}
exports.AplikoBuildEmbeds = AplikoBuildEmbeds;
function isMessageEmbedThumbnail(thumbnail) {
    try {
        return 'url' in thumbnail;
    }
    catch (_) { }
    return false;
}
