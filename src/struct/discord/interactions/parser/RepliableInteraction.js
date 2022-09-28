"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepliableInteraction = void 0;
const v9_1 = require("discord-api-types/rest/v9");
const __1 = require("../../../..");
const AplikoEmbed_ts_1 = require("../../../../util/conversion/AplikoEmbed.ts");
const ComponentsToDJS_1 = require("../../../../util/conversion/ComponentsToDJS");
const AplikoError_1 = require("../../../error/AplikoError");
const BaseInteraction_1 = require("./BaseInteraction");
class RepliableInteraction extends BaseInteraction_1.BaseInteraction {
    constructor() {
        super(...arguments);
        this.deferredEdit = false;
        this.deferredReply = false;
        this.replied = false;
    }
    /**
     * ACK the interaction and show the user a loading state in a follow up message
     * Edit the reply later via {@link editReply}
     *
     * @param ephemeral When true, only the user can see the reply
     */
    async deferReply(ephemeral) {
        if (this.deferredEdit)
            throw new AplikoError_1.AplikoError(`defer() called before deferReply()`, [`Use deferReply if you want to create a new message.`, `Use defer() if you want to edit the original message`]);
        if (this.replied)
            throw new AplikoError_1.AplikoError(`reply() called before deferReply()`, [`If you want to defer the reply, try calling deferReply() before reply()`]);
        if (this.deferredReply)
            return; // Silent catch deferring twice
        await this.getClient().rest.post(v9_1.Routes.interactionCallback(this.getId(), this.getToken()), {
            body: {
                type: __1.InteractionResponseType.DEFERRED_MESSAGE,
                data: {
                    flags: ephemeral ? 64 /* MessageFlags.Ephemeral */ : undefined
                }
            }
        });
        this.deferredReply = true;
    }
    /**
     * ACK the interaction and send a follow up message.
     *
     * @param message The content of the follow up message
     * @param ephemeral When true, only the user can see the reply
     */
    async reply(message, ephemeral) {
        if (this.deferredEdit)
            throw new AplikoError_1.AplikoError(`defer() was called before reply().`, [
                `If you're trying to update the original message, try calling edit()`,
                `If you're trying to make a new reply, remove defer()`,
                `If you're trying to edit a new reply, call deferReply() instead of defer()`
            ]);
        if (this.deferredReply)
            throw new AplikoError_1.AplikoError(`deferReply() was called before reply().`, [`Try calling editReply() instead of reply()`]);
        if (this.replied)
            throw new AplikoError_1.AplikoError(`reply() was called twice.`, [`Try calling editReply() instead.`]);
        await this.getClient().rest.post(v9_1.Routes.interactionCallback(this.getId(), this.getToken()), {
            body: {
                type: __1.InteractionResponseType.MESSAGE,
                data: {
                    flags: ephemeral ? 64 /* MessageFlags.Ephemeral */ : undefined,
                    content: message.content ? message.content : undefined,
                    embeds: message.embeds ? (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.getClient(), ...message.embeds) : [],
                    components: message.components ? (0, ComponentsToDJS_1.ComponentsToDJS)(...message.components) : []
                }
            }
        });
        this.replied = true;
        return this.getWebhook().fetchMessage('@original');
    }
    /**
     * Edit the message sent via @member deferReply or @member reply
     *
     * @param message The new content of the message
     */
    async editReply(message) {
        if (this.deferredEdit)
            throw new AplikoError_1.AplikoError(`defer() was called before editReply().`, [`Try calling deferReply() instead of defer()`]);
        if (!this.replied && !this.deferredReply)
            throw new AplikoError_1.AplikoError(`editReply() was called before deferReply() or reply()`, [`Try calling reply() instead of editReply()`]);
        return await this.getWebhook().editMessage('@original', {
            content: message.content ? message.content : undefined,
            embeds: message.embeds ? (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.getClient(), ...message.embeds) : [],
            components: message.components ? (0, ComponentsToDJS_1.ComponentsToDJS)(...message.components) : []
        });
    }
    /**
     * ACK the interaction and edit original message later.
     */
    async defer() {
        if (this.deferredReply)
            throw new AplikoError_1.AplikoError(`deferReply() called before defer()`, [`Use deferReply if you want to create a new message.`, `Use defer() if you want to edit the original message`]);
        if (this.replied)
            throw new AplikoError_1.AplikoError(`reply() called before defer()`, [`If you want to defer the reply, try calling deferReply() before reply()`]);
        if (this.deferredEdit)
            return; // Silent catch deferring twice
        await this.getClient().rest.post(v9_1.Routes.interactionCallback(this.getId(), this.getToken()), {
            body: {
                type: __1.InteractionResponseType.DEFERRED_UPDATE
            },
            auth: false
        });
        this.deferredEdit = true;
    }
    /**
     * If deferred or replied, updates the original message. If not, ACK's the interaction and updates the original message
     *
     * @param message The new content of the message
     */
    async edit(message) {
        if (this.deferredEdit || this.deferredReply || this.replied) {
            const original = (await this.getWebhook().fetchMessage('@original'));
            if (!original)
                throw 'Failed to edit message components parent. Original was falsy';
            await original.edit({
                content: message.content ? message.content : undefined,
                embeds: message.embeds ? (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.getClient(), ...message.embeds) : [],
                components: message.components ? (0, ComponentsToDJS_1.ComponentsToDJS)(...message.components) : []
            });
        }
        else {
            await this.getClient().rest.post(v9_1.Routes.interactionCallback(this.getId(), this.getToken()), {
                body: {
                    type: __1.InteractionResponseType.UPDATE,
                    data: {
                        content: message.content ? message.content : undefined,
                        embeds: message.embeds ? (0, AplikoEmbed_ts_1.AplikoBuildEmbeds)(this.getClient(), ...message.embeds) : [],
                        components: message.components ? (0, ComponentsToDJS_1.ComponentsToDJS)(...message.components) : []
                    }
                },
                auth: false
            });
        }
    }
    /**
     * Delets the original message
     */
    async delete() {
        const original = __1.$sftm(`Failed to fetch original message`, await this.getWebhook().fetchMessage('@original'));
        await original.delete();
    }
    async handleError(error) {
        console.log(error.toString());
        if (this.deferredReply || this.replied) {
            return this.editReply({
                embeds: [
                    {
                        style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                        description: error instanceof AplikoError_1.AplikoError ? 'A framework error has occurred. Contact an administrator' : error instanceof Error ? error.message : error
                    }
                ]
            });
        }
        if (this.deferredEdit) {
            return this.edit({
                embeds: [
                    {
                        style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                        description: error instanceof AplikoError_1.AplikoError ? 'A framework error has occurred. Contact an administrator' : error instanceof Error ? error.message : error
                    }
                ]
            });
        }
        return this.reply({
            embeds: [
                {
                    style: AplikoEmbed_ts_1.AplikoEmbedStyle.ERROR,
                    description: error instanceof AplikoError_1.AplikoError ? 'A framework error has occurred. Contact an administrator' : error instanceof Error ? error.message : error
                }
            ]
        }, true);
    }
    get wasReplyDeferred() {
        return this.deferredReply;
    }
    get wasEditDeferred() {
        return this.deferredEdit;
    }
    get didReply() {
        return this.replied;
    }
}
exports.RepliableInteraction = RepliableInteraction;
``;
