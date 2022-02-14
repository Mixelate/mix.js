import { ApiModalInteraction } from "../data";

export class ModalSubmitInteraction {

    private readonly channelId: string;
    private readonly userId: string;
    private readonly values: Map<string, string>;

    constructor(apiInteraction: ApiModalInteraction) {
        this.channelId = apiInteraction.channel_id;
        this.userId = apiInteraction.member.user.id;
        this.values = new Map();

        apiInteraction.data.components.forEach(actionRow => {
            actionRow.components.forEach(textField => {
                this.values.set(textField.custom_id, textField.value);
            })
        })
    }

    public getChannelId() {
        return this.channelId;
    }

    public getUserId() {
        return this.userId;
    }

    public hasKey(key: string): boolean {
        return this.values.has(key)
    }

    public getValue(key: string): string | undefined {
        return this.values.get(key)
    }

    public getValues(): Map<string, string> {
        return this.values;
    }

}