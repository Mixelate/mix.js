import { Routes } from "discord-api-types/v9";
import {
  GuildMember,
  GuildMemberResolvable,
  Interaction,
  Message,
} from "discord.js";
import { AplikoBot } from "../Bot";
import {
  ApiBaseInteraction,
  ApiModalSubmitInteraction,
  FormCollectionKey,
  InteractionType,
  IsApiModalInteraction,
} from "../struct";
import { ComponentCollectionKey } from "../struct/apliko/collector/ComponentCollectionKey";
import { MessageCollectionKey } from "../struct/apliko/collector/MessageCollectionKey";
import { ModalSubmitInteraction } from "../struct/discord/interactions/parser/ModalSubmitInteraction";
import { SafeDeleteMessage } from "../util";
import { defer, Deferred } from "../util/Defer";
import { getUserIdFromMention } from "../util/discord/MentionParser";
import { ThrowError } from "../util/Errors";

export class CollectorManager {
  private _awaitingMessage: Map<MessageCollectionKey, Deferred<Message>> =
    new Map();
  private _awaitingSelection: Map<ComponentCollectionKey, Deferred<string>> =
    new Map();
  private _awaitingButton: Map<ComponentCollectionKey, Deferred<string>> =
    new Map();
  private _awaitingForm: Map<FormCollectionKey, Deferred<Map<string, string>>> =
    new Map();
  private _awaitingModal: Map<
    FormCollectionKey,
    Deferred<{
      responses: Map<string, string>;
      interaction: ModalSubmitInteraction;
    }>
  > = new Map();

  constructor(bot: AplikoBot) {
    bot.client.on("messageCreate", this.onMessageCreate.bind(this));
    bot.client.on("interactionCreate", this.onInteractionCreate.bind(this));
    bot.client.ws.on(
      "INTERACTION_CREATE",
      (interaction: ApiBaseInteraction<InteractionType>) => {
        if (IsApiModalInteraction(interaction)) {
          const modalSubmitInteraction = new ModalSubmitInteraction(
            bot,
            interaction as ApiModalSubmitInteraction
          );

          this._awaitingModal.forEach(async (deferred, formCollectionKey) => {
            if (modalSubmitInteraction.getUserId() != formCollectionKey.userId)
              return;
            if (
              modalSubmitInteraction.getChannelId() !=
              formCollectionKey.channelId
            )
              return;

            await bot.rest.post(
              Routes.interactionCallback(interaction.id, interaction.token),
              {
                body: {
                  type: formCollectionKey.responseType
                    ? formCollectionKey.responseType
                    : 6,
                },
              }
            );

            deferred.resolve?.({
              responses: modalSubmitInteraction.getValues(),
              interaction: modalSubmitInteraction,
            });
            this._awaitingModal.delete(formCollectionKey);
          });

          this._awaitingForm.forEach(
            async (deferredValues, formCollectionKey) => {
              if (
                modalSubmitInteraction.getUserId() != formCollectionKey.userId
              )
                return;
              if (
                modalSubmitInteraction.getChannelId() !=
                formCollectionKey.channelId
              )
                return;

              await bot.rest.post(
                Routes.interactionCallback(interaction.id, interaction.token),
                {
                  body: {
                    type: formCollectionKey.responseType
                      ? formCollectionKey.responseType
                      : 6,
                  },
                }
              );

              deferredValues.resolve?.(modalSubmitInteraction.getValues());
              this._awaitingForm.delete(formCollectionKey);
            }
          );
        }
      }
    );
  }

  private async onMessageCreate(message: Message) {
    this._awaitingMessage.forEach((deferredMessage, messageCollectionKey) => {
      if (message.member != messageCollectionKey.userResolvable) return;
      if (message.channel != messageCollectionKey.channelResolvable) return;

      // Call the message collector
      deferredMessage.resolve?.(message);

      SafeDeleteMessage(message);

      // Delete it from the awaiting map
      this._awaitingMessage.delete(messageCollectionKey);
    });
  }

  private async onInteractionCreate(interaction: Interaction) {
    if (interaction.isSelectMenu()) {
      this._awaitingSelection.forEach(
        (deferredSelection, componentCollectionKey) => {
          if (
            interaction.member != componentCollectionKey.guildMemberResolvable
          )
            return;
          if (interaction.message != componentCollectionKey.messageResolvable)
            return;
          if (interaction.customId != componentCollectionKey.componentId)
            return;

          interaction.deferUpdate().catch(() => null);
          deferredSelection.resolve!(interaction.values[0]);
          console.log("res");
          this._awaitingSelection.delete(componentCollectionKey);
        }
      );
    }

    if (interaction.isButton()) {
      this._awaitingButton.forEach((deferredButton, componentCollectionKey) => {
        if (interaction.member != componentCollectionKey.guildMemberResolvable)
          return;
        if (interaction.message != componentCollectionKey.messageResolvable)
          return;
        if (interaction.customId != componentCollectionKey.componentId) return;

        interaction.deferUpdate().catch(() => null);
        deferredButton.resolve!(interaction.customId);
        this._awaitingButton.delete(componentCollectionKey);
      });
    }
  }

  public async collectMessage(
    messageCollectionKey: MessageCollectionKey
  ): Promise<Message> {
    let deferredMessage = defer<Message>();

    this._awaitingMessage
      .get(messageCollectionKey)
      ?.reject?.(
        "You started another interaction before finishing this one so it's been terminated."
      );
    this._awaitingMessage.set(messageCollectionKey, deferredMessage);

    return deferredMessage.promise!;
  }

  public async collectMemberMention(
    messageCollectionKey: MessageCollectionKey
  ): Promise<GuildMember> {
    let deferredMessage = defer<Message>();

    this._awaitingMessage
      .get(messageCollectionKey)
      ?.reject?.(
        "You started another interaction before finishing this one so it's been terminated."
      );
    this._awaitingMessage.set(messageCollectionKey, deferredMessage);

    const message = await deferredMessage.promise!;
    const userId =
      (await getUserIdFromMention(message.content)) ||
      ThrowError("Make sure your message only contains a member mention");
    const resolvedMember =
      message.guild!.members.resolve(userId) ||
      ThrowError("Failed to find the mentioned member");
    return resolvedMember;
  }

  public async collectSelection(
    selectionCollectionKey: ComponentCollectionKey
  ): Promise<string> {
    let deferredSelection = defer<string>();

    this._awaitingSelection
      .get(selectionCollectionKey)
      ?.reject?.(
        "You started another interaction before finishing this one so it's been terminated."
      );
    this._awaitingSelection.set(selectionCollectionKey, deferredSelection);

    return deferredSelection.promise!;
  }

  public async collectButton(
    componentCollectionKey: ComponentCollectionKey
  ): Promise<string> {
    let deferredButton = defer<string>();

    this._awaitingButton
      .get(componentCollectionKey)
      ?.reject?.(
        "You started another interaction before finishing this one so it's been terminated."
      );
    this._awaitingButton.set(componentCollectionKey, deferredButton);

    return deferredButton.promise!;
  }

  public async collectForm(
    formCollectionKey: FormCollectionKey
  ): Promise<Map<string, string>> {
    let deferredValues = defer<Map<string, string>>();

    this._awaitingModal
      .get(formCollectionKey)
      ?.reject?.(
        "You started another interaction before finishing this one so it's been terminated."
      );

    this._awaitingForm
      .get(formCollectionKey)
      ?.reject?.(
        "You started another interaction before finishing this one so it's been terminated."
      );
    this._awaitingForm.set(formCollectionKey, deferredValues);

    return deferredValues.promise!;
  }

  public async collectModal(formCollectionKey: FormCollectionKey): Promise<{
    responses: Map<string, string>;
    interaction: ModalSubmitInteraction;
  }> {
    let deferredValues = defer<{
      responses: Map<string, string>;
      interaction: ModalSubmitInteraction;
    }>();

    this._awaitingModal
      .get(formCollectionKey)
      ?.reject?.(
        "You started another interaction before finishing this one so it's been terminated."
      );

    this._awaitingForm
      .get(formCollectionKey)
      ?.reject?.(
        "You started another interaction before finishing this one so it's been terminated."
      );

    this._awaitingModal.set(formCollectionKey, deferredValues);

    return deferredValues.promise!;
  }
}

export interface MessageCollector {
  (message: Message | null): Promise<any>;
}
