"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
const discord_js_1 = require("discord.js");
class Embed {
    constructor() {
        this.data = {};
        this.useTwoColumnFieldRows = false;
    }
    static new() {
        return new Embed().color(this.DEFAULT_COLOR);
    }
    title(title) {
        this.data.title = title;
        return this;
    }
    description(description) {
        this.data.description = description;
        return this;
    }
    color(color) {
        this.data.color = this.HEXToVBColor(color);
        return this;
    }
    danger() {
        this.data.color = this.HEXToVBColor('#aa5555');
        return this;
    }
    success() {
        this.data.color = this.HEXToVBColor('#55aa55');
        return this;
    }
    footer(text, imageUrl, proxyImageUrl) {
        this.data.footer = {
            text,
            icon_url: imageUrl,
            proxy_icon_url: proxyImageUrl
        };
        return this;
    }
    image(url, width, height) {
        this.data.image = {
            url,
            width,
            height
        };
        return this;
    }
    proxyImage(url, proxyUrl, width, height) {
        this.data.image = {
            url,
            proxy_url: proxyUrl,
            width,
            height
        };
        return this;
    }
    thumbnail(url, width, height) {
        this.data.thumbnail = {
            url,
            width,
            height
        };
        return this;
    }
    proxyThumbnail(url, proxyUrl, width, height) {
        this.data.thumbnail = {
            url,
            proxy_url: proxyUrl,
            width,
            height
        };
        return this;
    }
    video(url, width, height) {
        this.data.video = {
            url,
            width,
            height
        };
        return this;
    }
    proxyVideo(url, proxyUrl, width, height) {
        this.data.video = {
            url,
            proxy_url: proxyUrl,
            width,
            height
        };
        return this;
    }
    author(name, avatarUrl) {
        this.data.author = {
            name,
            icon_url: avatarUrl,
        };
        return this;
    }
    linkAuthor(name, url, avatarUrl) {
        this.data.author = {
            name,
            url,
            icon_url: avatarUrl,
        };
        return this;
    }
    proxyAuthor(name, avatarUrl, proxyAvatarUrl) {
        this.data.author = {
            name,
            icon_url: avatarUrl,
            proxy_icon_url: proxyAvatarUrl
        };
        return this;
    }
    proxyLinkAuthor(name, url, avatarUrl, proxyAvatarUrl) {
        this.data.author = {
            name,
            url,
            icon_url: avatarUrl,
            proxy_icon_url: proxyAvatarUrl
        };
        return this;
    }
    field(title, content) {
        if (!this.data.fields)
            this.data.fields = [{ name: title, value: content }];
        else
            this.data.fields.push({ name: title, value: content });
        return this;
    }
    inlineField(title, content) {
        if (!this.data.fields)
            this.data.fields = [{ name: title, value: content, inline: true }];
        else
            this.data.fields.push({ name: title, value: content, inline: true });
        return this;
    }
    fields(...fields) {
        if (!this.data.fields)
            this.data.fields = [...fields];
        else
            this.data.fields.push(...fields);
        return this;
    }
    twoColumnFieldRows() {
        this.useTwoColumnFieldRows = true;
        return this;
    }
    toJSON() {
        const fields = this.data.fields;
        this.data.fields = [];
        if (!fields || fields.length == 0)
            return this.data;
        for (const field of fields) {
            this.data.fields.push(field);
            if (this.useTwoColumnFieldRows && field.inline && (this.data.fields.length % 4 === 0 || this.data.fields.length === 1))
                this.data.fields.push({
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                });
        }
        return this.data;
    }
    HEXToVBColor(rrggbb) {
        return discord_js_1.Util.resolveColor(rrggbb);
    }
}
exports.Embed = Embed;
Embed.DEFAULT_COLOR = '#65a7e6';
