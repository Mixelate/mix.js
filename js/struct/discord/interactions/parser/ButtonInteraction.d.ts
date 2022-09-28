import { ApiButtonInteraction, Client } from '../../../..';
import { RepliableInteraction } from './RepliableInteraction';
export declare class ButtonInteraction extends RepliableInteraction {
    private readonly customId;
    constructor(client: Client, data: ApiButtonInteraction);
    getCustomId(): string;
}
