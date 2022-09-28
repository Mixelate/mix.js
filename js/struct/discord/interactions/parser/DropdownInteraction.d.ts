import { ApiDropdownInteraction, Client } from '../../../..';
import { RepliableInteraction } from './RepliableInteraction';
export declare class DropdownInteraction extends RepliableInteraction {
    private readonly customId;
    private readonly values;
    constructor(client: Client, data: ApiDropdownInteraction);
    getCustomId(): string;
    getValue(index: number): string;
    getValues(): string[];
}
