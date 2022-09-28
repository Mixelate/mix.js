import { AplikoEmbed } from '../..';
import { ActionRow } from './components/builder/ActionRow';
export interface Message {
    content?: string;
    embeds?: AplikoEmbed[];
    components?: ActionRow[];
}
