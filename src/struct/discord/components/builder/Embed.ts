import { Util } from "discord.js";
import { ApiEmbed, ApiEmbedField } from "../api/ApiEmbed";

export class Embed {

    private data: ApiEmbed;
    private useTwoColumnFieldRows: boolean;

    public constructor() {
        this.data = {};
        this.useTwoColumnFieldRows = false;
    }

    public static new(): Embed {
        return new Embed().color('#65a7e6');
    }

    public title(title: string): Embed {
        this.data.title = title;
        return this;
    }

    public description(description: string): Embed {
        this.data.description = description;
        return this;
    }

    public color(color: `#${string}`): Embed {
        this.data.color = this.HEXToVBColor(color);
        return this;
    }

    public danger(): Embed {
        this.data.color = this.HEXToVBColor('#aa5555');
        return this;
    }

    public success(): Embed {
        this.data.color = this.HEXToVBColor('#55aa55');
        return this;
    }

    public footer(text: string, imageUrl?: string, proxyImageUrl?: string): Embed {
        this.data.footer = {
            text,
            icon_url: imageUrl,
            proxy_icon_url: proxyImageUrl
        };
        return this;
    }

    public image(url: string, width?: number, height?: number): Embed {
        this.data.image = {
            url,
            width,
            height
        };
        return this;
    }

    public proxyImage(url: string, proxyUrl: string, width?: number, height?: number): Embed {
        this.data.image = {
            url,
            proxy_url: proxyUrl,
            width,
            height
        };
        return this;
    }

    public thumbnail(url: string, width?: number, height?: number): Embed {
        this.data.thumbnail = {
            url,
            width,
            height
        };
        return this;
    }

    public proxyThumbnail(url: string, proxyUrl: string, width?: number, height?: number): Embed {
        this.data.thumbnail = {
            url,
            proxy_url: proxyUrl,
            width,
            height
        };
        return this;
    }

    public video(url: string, width?: number, height?: number): Embed {
        this.data.video = {
            url,
            width,
            height
        };
        return this;
    }

    public proxyVideo(url: string, proxyUrl: string, width?: number, height?: number): Embed {
        this.data.video = {
            url,
            proxy_url: proxyUrl,
            width,
            height
        };
        return this;
    }

    public author(name: string, avatarUrl?: string): Embed {
        this.data.author = {
            name,
            icon_url: avatarUrl,
        };
        return this;
    }

    public linkAuthor(name: string, url: string, avatarUrl?: string): Embed {
        this.data.author = {
            name,
            url,
            icon_url: avatarUrl,
        };
        return this;
    }

    public proxyAuthor(name: string, avatarUrl: string, proxyAvatarUrl: string): Embed {
        this.data.author = {
            name,
            icon_url: avatarUrl,
            proxy_icon_url: proxyAvatarUrl
        };
        return this;
    }

    public proxyLinkAuthor(name: string, url: string, avatarUrl: string, proxyAvatarUrl: string): Embed {
        this.data.author = {
            name,
            url,
            icon_url: avatarUrl,
            proxy_icon_url: proxyAvatarUrl
        };
        return this;
    }

    public field(title: string, content: string): Embed {
        if (!this.data.fields)
            this.data.fields = [{ name: title, value: content }];
        else
            this.data.fields.push({ name: title, value: content });

        return this;
    }

    public inlineField(title: string, content: string): Embed {
        if (!this.data.fields)
            this.data.fields = [{ name: title, value: content, inline: true }];
        else
            this.data.fields.push({ name: title, value: content, inline: true });

        return this;
    }

    public fields(...fields: ApiEmbedField[]) {
        if (!this.data.fields)
            this.data.fields = [...fields];
        else
            this.data.fields.push(...fields);

        return this;
    }

    public twoColumnFieldRows(): Embed {
        this.useTwoColumnFieldRows = true;
        return this;
    }

    public toJSON(): ApiEmbed {
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

    private HEXToVBColor(rrggbb): number {
        return Util.resolveColor(rrggbb)
    }

}