import { ApiModalSubmitInteraction, Client } from '../../../..';
import { RepliableInteraction } from './RepliableInteraction';

export class ModalSubmitInteraction extends RepliableInteraction {
    private readonly customId: string;
    private readonly values: Map<string, string>;

    constructor(client: Client, data: ApiModalSubmitInteraction) {
        super(client, data);
        this.customId = data.data.custom_id;
        this.values = new Map();
        data.data.components.forEach((actionRow) => {
            actionRow.components.forEach((textField) => {
                this.values.set(textField.custom_id, textField.value);
            });
        });
    }

    public getCustomId() {
        return this.customId;
    }

    public hasKey(key: string): boolean {
        return this.values.has(key);
    }

    public getValue(key: string): string | undefined {
        return this.values.get(key);
    }

    public getValues(): Map<string, string> {
        return this.values;
    }
}
