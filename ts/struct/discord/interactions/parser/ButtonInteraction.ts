import { ApiButtonInteraction, ApiModalSubmitInteraction, Client } from '../../../..';
import { RepliableInteraction } from './RepliableInteraction';

export class ButtonInteraction extends RepliableInteraction {
    private readonly customId: string;

    constructor(client: Client, data: ApiButtonInteraction) {
        super(client, data);
        this.customId = data.data.custom_id;
    }

    public getCustomId() {
        return this.customId;
    }
}
