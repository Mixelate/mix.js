import { AplikoBot } from '../../../../Bot';
import { ApiButtonInteraction, ApiModalSubmitInteraction } from '../data';
import { RepliableInteraction } from './RepliableInteraction';

export class ButtonInteraction extends RepliableInteraction {

  private readonly customId: string;

  constructor(bot: AplikoBot, data: ApiButtonInteraction) {
    super(bot, data);
    this.customId = data.data.custom_id;
  }

  public getCustomId() {
    return this.customId;
  }

}