import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { Client, InteractionWebhook, MessageEmbed, MessageFlags } from "discord.js";
import { AplikoBot } from "../../../../Bot";
import { ComponentsToDJS } from "../../../../util";
import { ActionRow, Component } from "../../components";
import { ApiModalSubmitInteraction } from "../data";
import { InteractionResponseType } from "../enum";

export class ModalSubmitInteraction {
  private readonly bot: AplikoBot
  private readonly webhook: InteractionWebhook;
  private readonly id: string;
  private readonly token: string
  private readonly customId: string;
  private readonly channelId: string;
  private readonly userId: string;
  private readonly values: Map<string, string>;

  constructor(bot: AplikoBot, data: ApiModalSubmitInteraction) {
    this.bot = bot;
    this.webhook = new InteractionWebhook(bot.client, data.application_id, data.token)
    this.id = data.id;
    this.token = data.token;
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

  public async deferReply(ephemeral: boolean) {
    await this.bot.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.DEFERRED_MESSAGE,
        data: {
          flags: ephemeral ? MessageFlags.FLAGS.EPHEMERAL : undefined
        }
      }
    });
  }

  public async reply(embeds: MessageEmbed[], components: ActionRow[]) {
    await this.bot.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.MESSAGE,
        data: {
          embeds: embeds.map(embed => embed.toJSON()),
          components: components.map(component => component.toJSON())
        }
      }
    });
  }

  public async editReply(embeds: MessageEmbed[], components: ActionRow[]) {
    await this.webhook.editMessage('@original', {
      embeds,
      components: ComponentsToDJS(...components)
    })
  }

  public getBot() {
    return this.bot;
  }

  public getWebhook() {
    return this.webhook;
  }

  public getId() {
    return this.id
  }

  public getToken() {
    return this.token;
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
