import { Component } from "@discordjs/builders";
import {
  ButtonInteraction,
  Interaction,
  Message,
  SelectMenuInteraction,
  TextChannel,
} from "discord.js";
import { AplikoBot } from "../Bot";
import { CallbackHandler, RegisterCallbacks } from "../decorator";
import { CALLBACK_WILDCARD } from "../decorator/DecoratorSymbols";
import {
  AplikoBuildEmbeds,
  AplikoEmbedStyle,
} from "../util/conversion/AplikoEmbed";
import { SilentCatch, ThrowError } from "../util/Errors";
import {
  ButtonInteractionContext,
  ModalInteractionContext,
  SelectMenuInteractionContext,
} from "../struct/apliko/Contexts";
import { FetchComponentInteractionData } from "../struct/apliko/ComponentInteractionData";
import { ApiBaseInteraction } from "../struct/discord/interactions/data/ApiBaseInteraction";
import { InteractionType } from "../struct/discord/interactions/enum/InteractionType";
import {
  ApiModalSubmitInteraction,
  IsApiModalInteraction,
} from "../struct/discord/interactions/data/ApiModalInteraction";
import { ModalSubmitInteraction } from "../struct/discord/interactions/parser/ModalSubmitInteraction";
import { AplikoError } from "../struct";

export class InteractionHandler implements CallbackHandler {
  protected _bot: AplikoBot;
  private _stopped: boolean;

  // Callbacks
  public buttonCallbacks: Map<
    string,
    (context: ButtonInteractionContext) => Promise<any>
  >;
  public selectCallbacks: Map<
    string,
    (context: SelectMenuInteractionContext) => Promise<any>
  >;
  public modalCallbacks: Map<
    string,
    (context: ModalInteractionContext) => Promise<any>
  >;

  public constructor(bot: AplikoBot) {
    this._bot = bot;
    this._stopped = false;
    this.buttonCallbacks = new Map();
    this.selectCallbacks = new Map();
    this.modalCallbacks = new Map();
    this._bot.client.on(
      "interactionCreate",
      this.onInteractionCreate.bind(this)
    );

    bot.client.ws.on(
      "INTERACTION_CREATE",
      (interaction: ApiBaseInteraction<InteractionType>) => {
        if (IsApiModalInteraction(interaction)) {
          const modalSubmitInteraction = new ModalSubmitInteraction(
            bot,
            interaction as ApiModalSubmitInteraction
          );

          return new Promise<void>(async (resolve, reject) => {
            try {
              const componentInteractionData =
                await FetchComponentInteractionData(
                  modalSubmitInteraction.getCustomId()
                );

              await this.modalCallbacks
                .get(componentInteractionData.componentId)
                ?.apply(this, [
                  <ModalInteractionContext>{
                    interaction: modalSubmitInteraction,
                    data: componentInteractionData,
                  },
                ]);
            } catch (err) {
              await modalSubmitInteraction.handleError(err)
            }

            resolve();
          });
        }
      }
    );
  }

  public async stop() {
    this._stopped = true;
  }

  public async onInteractionCreate(interaction: Interaction) {
    if (this._stopped) return;
    if (!interaction.isMessageComponent()) return;

    try {
      const componentInteractionData = await FetchComponentInteractionData(
        interaction.customId
      );

      if (interaction.isButton()) {
        await this.buttonCallbacks
          .get(componentInteractionData.componentId)
          ?.apply(this, [
            <ButtonInteractionContext>{
              interaction,
              data: componentInteractionData,
            },
          ]);
      }

      if (interaction.isSelectMenu()) {
        await this.selectCallbacks
          .get(componentInteractionData.componentId)
          ?.apply(this, [
            <SelectMenuInteractionContext>{
              interaction,
              data: componentInteractionData,
            },
          ]);
      }
    } catch (error: any) {
      if (!error) return console.log(error);

      await interaction.deferReply({ ephemeral: true }).catch((_) => {});
      await interaction.editReply({
        embeds: AplikoBuildEmbeds({
          style: AplikoEmbedStyle.ERROR,
          description: "An error occurred while processing your interaction.",
          footer: {
            content: error.toString(),
          },
        }),
      });
    }
  }

  public get bot(): AplikoBot {
    return this._bot;
  }
}
