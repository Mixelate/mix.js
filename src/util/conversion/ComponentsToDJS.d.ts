import { MessageActionRow } from 'discord.js';
import { ActionRow } from '../../struct/discord/components/builder/ActionRow';
export declare function ComponentsToDJS(...actionRows: (ActionRow | undefined)[]): MessageActionRow[];
