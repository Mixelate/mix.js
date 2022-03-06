import { AplikoError } from '../../../error/AplikoError';
import { ApiButtonInteraction, ApiDropdownInteraction, ApiModalSubmitInteraction, Client } from '../../../..';
import { RepliableInteraction } from './RepliableInteraction';

export class DropdownInteraction extends RepliableInteraction {
    private readonly customId: string;
    private readonly values: string[];

    constructor(client: Client, data: ApiDropdownInteraction) {
        super(client, data);
        this.customId = data.data.custom_id;
        this.values = data.data.values;
    }

    public getCustomId() {
        return this.customId;
    }

    public getValue(index: number): string {
        if (index > this.values.length - 1) throw new AplikoError(`Trying to fetch value at index ${index} but values only has ${this.values.length} entries`);

        return this.values[index];
    }

    public getValues(): string[] {
        return this.values;
    }
}
