import { APIMessage, MessageFlags } from 'discord-api-types/payloads/v9';
import { Routes } from 'discord-api-types/rest/v9';
import { Message } from 'discord.js';
import { $falsyThrow, InteractionResponseType } from '../../../..';
import { AplikoBuildEmbeds, AplikoEmbedStyle } from '../../../../util/conversion/AplikoEmbed.ts';
import { ComponentsToDJS } from '../../../../util/conversion/ComponentsToDJS';
import { Message as AplikoMessage } from '../../Message';
import { AplikoError } from '../../../error/AplikoError';
import { BaseInteraction } from './BaseInteraction';

export class RepliableInteraction extends BaseInteraction {
    private deferredEdit: boolean = false;
    private deferredReply: boolean = false;
    private replied: boolean = false;

    /**
     * ACK the interaction and show the user a loading state in a follow up message
     * Edit the reply later via {@link editReply}
     *
     * @param ephemeral When true, only the user can see the reply
     */
    public async deferReply(ephemeral?: boolean) {
        if (this.deferredEdit)
            throw new AplikoError(`defer() called before deferReply()`, [`Use deferReply if you want to create a new message.`, `Use defer() if you want to edit the original message`]);

        if (this.replied) throw new AplikoError(`reply() called before deferReply()`, [`If you want to defer the reply, try calling deferReply() before reply()`]);

        if (this.deferredReply) return; // Silent catch deferring twice

        await this.getClient().rest.post(Routes.interactionCallback(this.getId(), this.getToken()), {
            body: {
                type: InteractionResponseType.DEFERRED_MESSAGE,
                data: {
                    flags: ephemeral ? MessageFlags.Ephemeral : undefined
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
    public async reply(message: AplikoMessage, ephemeral?: boolean) {
        if (this.deferredEdit)
            throw new AplikoError(`defer() was called before reply().`, [
                `If you're trying to update the original message, try calling edit()`,
                `If you're trying to make a new reply, remove defer()`,
                `If you're trying to edit a new reply, call deferReply() instead of defer()`
            ]);

        if (this.deferredReply) throw new AplikoError(`deferReply() was called before reply().`, [`Try calling editReply() instead of reply()`]);

        if (this.replied) throw new AplikoError(`reply() was called twice.`, [`Try calling editReply() instead.`]);

        await this.getClient().rest.post(Routes.interactionCallback(this.getId(), this.getToken()), {
            body: {
                type: InteractionResponseType.MESSAGE,
                data: {
                    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
                    content: message.content ? message.content : undefined,
                    embeds: message.embeds ? AplikoBuildEmbeds(this.getClient(), ...message.embeds) : [],
                    components: message.components ? ComponentsToDJS(...message.components) : []
                }
            }
        });

        this.replied = true;
    }

    /**
     * Edit the message sent via @member deferReply or @member reply
     *
     * @param message The new content of the message
     */
    public async editReply(message: AplikoMessage) {
        if (this.deferredEdit) throw new AplikoError(`defer() was called before editReply().`, [`Try calling deferReply() instead of defer()`]);

        if (!this.replied && !this.deferredReply) throw new AplikoError(`editReply() was called before deferReply() or reply()`, [`Try calling reply() instead of editReply()`]);

        return await this.getWebhook().editMessage('@original', {
            content: message.content ? message.content : undefined,
            embeds: message.embeds ? AplikoBuildEmbeds(this.getClient(), ...message.embeds) : [],
            components: message.components ? ComponentsToDJS(...message.components) : []
        });
    }

    /**
     * ACK the interaction and edit original message later.
     */
    public async defer() {
        if (this.deferredReply)
            throw new AplikoError(`deferReply() called before defer()`, [`Use deferReply if you want to create a new message.`, `Use defer() if you want to edit the original message`]);

        if (this.replied) throw new AplikoError(`reply() called before defer()`, [`If you want to defer the reply, try calling deferReply() before reply()`]);

        if (this.deferredEdit) return; // Silent catch deferring twice

        await this.getClient().rest.post(Routes.interactionCallback(this.getId(), this.getToken()), {
            body: {
                type: InteractionResponseType.DEFERRED_UPDATE
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
    public async edit(message: AplikoMessage) {
        if (this.deferredEdit || this.deferredReply || this.replied) {
            const original = (await this.getWebhook().fetchMessage('@original')) as Message;

            if (!original) throw 'Failed to edit message components parent. Original was falsy';

            await original.edit({
                content: message.content ? message.content : undefined,
                embeds: message.embeds ? AplikoBuildEmbeds(this.getClient(), ...message.embeds) : [],
                components: message.components ? ComponentsToDJS(...message.components) : []
            });
        } else {
            await this.getClient().rest.post(Routes.interactionCallback(this.getId(), this.getToken()), {
                body: {
                    type: InteractionResponseType.UPDATE,
                    data: {
                        content: message.content ? message.content : undefined,
                        embeds: message.embeds ? AplikoBuildEmbeds(this.getClient(), ...message.embeds) : [],
                        components: message.components ? ComponentsToDJS(...message.components) : []
                    }
                },
                auth: false
            });
        }
    }

    /**
     * Delets the original message
     */
    public async delete() {
        const original = $falsyThrow!(`Failed to fetch original message`, await this.getWebhook().fetchMessage('@original')) as Message;

        await original.delete();
    }

    public async handleError(error: any) {
        console.log(error.toString());

        if (this.deferredReply || this.replied) {
            return this.editReply({
                embeds: [
                    {
                        style: AplikoEmbedStyle.ERROR,
                        description: error instanceof AplikoError ? 'A framework error has occurred. Contact an administrator' : error instanceof Error ? error.message : error
                    }
                ]
            });
        }

        if (this.deferredEdit) {
            return this.edit({
                embeds: [
                    {
                        style: AplikoEmbedStyle.ERROR,
                        description: error instanceof AplikoError ? 'A framework error has occurred. Contact an administrator' : error instanceof Error ? error.message : error
                    }
                ]
            });
        }

        return this.reply(
            {
                embeds: [
                    {
                        style: AplikoEmbedStyle.ERROR,
                        description: error instanceof AplikoError ? 'A framework error has occurred. Contact an administrator' : error instanceof Error ? error.message : error
                    }
                ]
            },
            true
        );
    }

    public get wasReplyDeferred(): boolean {
        return this.deferredReply;
    }

    public get wasEditDeferred(): boolean {
        return this.deferredEdit;
    }

    public get didReply(): boolean {
        return this.replied;
    }
}
``;
