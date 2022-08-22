import { MessageAttachment } from 'discord.js';
import { AplikoEmbed } from '../../..';
import { ActionRow } from '../../..';

export interface PageContent {
    embeds?: AplikoEmbed[]; 

    components: (ActionRow | undefined)[];

    attachments?: MessageAttachment[]
}
