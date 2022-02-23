import { Interaction } from "discord.js";
import {
  PanelButtonInteractionContext,
  PanelContext,
  PanelPage,
  PanelSelectMenuInteractionContext,
} from "../application/panel";
import { AplikoBot } from "../Bot";
import { FetchComponentInteractionData } from "../struct/apliko/ComponentInteractionData";
import {
  AplikoBuildComponentRows,
  AplikoBuildEmbeds,
  ComponentsToDJS,
  RepliableInteraction,
  ThrowError,
} from "../util";

export type PanelPageClass = { new (...args: any[]): PanelPage };

export class PanelManager {
  private _bot: AplikoBot;

  private _panelPageCache: Map<PanelPageClass, PanelPage>;
  private _panelContextCache: Map<string, PanelContext>;

  constructor(bot: AplikoBot) {
    this._bot = bot;
    this._panelPageCache = new Map();
    this._panelContextCache = new Map();
    this._bot.client.on(
      "interactionCreate",
      this.onInteractionCreate.bind(this)
    );
  }

  public async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isMessageComponent()) return;
    if (!this._panelContextCache.has(interaction.message.id)) return;

    const context = this._panelContextCache.get(interaction.message.id)!;
    const componentInteractionData = await FetchComponentInteractionData(
      interaction.customId
    );

    if (interaction.isButton()) {
      context.currentPage.onButton(
        <PanelButtonInteractionContext>{
          interaction: interaction,
          data: componentInteractionData,
          panelContext: context,
        },
        componentInteractionData
      );
    }

    if (interaction.isSelectMenu()) {
      context.currentPage.onSelect(
        <PanelSelectMenuInteractionContext>{
          interaction: interaction,
          data: componentInteractionData,
          panelContext: context,
        },
        componentInteractionData
      );
    }
  }

  public async openPanel(
    interaction: RepliableInteraction,
    pageClass: PanelPageClass
  ) {
    const page =
      this._panelPageCache.get(pageClass) ||
      ThrowError("Panel page is not cached.");

    const replyMessage = await interaction.deferReply({
      ephemeral: true,
      fetchReply: true,
    });

    const context = {
      interaction,
      replyMessageId: replyMessage.id,
      currentPage: page,
    };

    this._panelContextCache.set(replyMessage.id, context);
    this.openPage(context, pageClass);
  }

  public async openDynamicPanel(
    interaction: RepliableInteraction,
    page: PanelPage
  ) {
    const replyMessage = await interaction.deferReply({
      ephemeral: true,
      fetchReply: true,
    });

    const context = {
      interaction,
      replyMessageId: replyMessage.id,
      currentPage: page,
    };

    this._panelContextCache.set(replyMessage.id, context);
    this.openDynamicPage(context, page);
  }

  public async openDynamicPage(context: PanelContext, page: PanelPage) {
    context.currentPage = page;
    await this.refreshPage(context);
  }

  public async openPage(context: PanelContext, pageClass: PanelPageClass) {
    const page =
      this._panelPageCache.get(pageClass) ||
      ThrowError("Panel page is not cached.");

    context.currentPage = page;
    await this.refreshPage(context);
  }

  public async refreshPage(context: PanelContext) {
    const pageContent = await context.currentPage.constructPage(context);

    await context.interaction.editReply({
      embeds: AplikoBuildEmbeds(...pageContent.embeds),
      components: ComponentsToDJS(...pageContent.components),
    });
  }

  public registerPage(page: PanelPage) {
    this._panelPageCache.set(Object.getPrototypeOf(page).constructor, page);
  }
}
