import { AplikoBot } from '../../../../Bot';
import { ApiModalSubmitInteraction } from '../data';
import { RepliableInteraction } from './RepliableInteraction';

export class ModalSubmitInteraction extends RepliableInteraction {

  private readonly customId: string;
  private readonly values: Map<string, string>;

  constructor(bot: AplikoBot, data: ApiModalSubmitInteraction) {
    super(bot, data);
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