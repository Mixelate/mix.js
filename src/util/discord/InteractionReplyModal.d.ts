import { Interaction } from 'discord.js';
import { Modal } from '../..';
import { BaseInteraction } from '../../struct/discord/interactions/parser/BaseInteraction';
export declare function InteractionReplyModal(interaction: Interaction | BaseInteraction, modalInteraction: Modal): Promise<void>;
