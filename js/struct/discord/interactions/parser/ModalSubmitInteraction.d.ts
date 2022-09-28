import { ApiModalSubmitInteraction, Client } from '../../../..';
import { RepliableInteraction } from './RepliableInteraction';
export declare class ModalSubmitInteraction extends RepliableInteraction {
    private readonly customId;
    private readonly values;
    constructor(client: Client, data: ApiModalSubmitInteraction);
    getCustomId(): string;
    hasKey(key: string): boolean;
    getValue(key: string): string | undefined;
    getValues(): Map<string, string>;
}
