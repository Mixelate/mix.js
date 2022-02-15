import { ApiModalSubmitInteraction } from "../data";

export class ModalSubmitInteraction {
  private readonly customId: string;
  private readonly channelId: string;
  private readonly userId: string;
  private readonly values: Map<string, string>;

  constructor(data: ApiModalSubmitInteraction) {
    this.customId = data.data.custom_id;
    this.channelId = data.channel_id;
    this.userId = data.member!.user.id;
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

  public getChannelId() {
    return this.channelId;
  }

  public getUserId() {
    return this.userId;
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
