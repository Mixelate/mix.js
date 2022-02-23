import {
  AplikoEmbed,
  AplikoEmbedStyle,
} from "../../util/conversion/AplikoEmbed";
import { AplikoComponent } from "../../util/conversion/AplikoComponent";
import {
  ButtonInteractionContext,
  SelectMenuInteractionContext,
} from "../../struct/apliko/Contexts";
import { CallbackHandler } from "../../decorator/callback/RegisterCallbacks";
import {
  PanelButtonInteractionContext,
  PanelContext,
  PanelSelectMenuInteractionContext,
} from "./PanelContext";
import { AplikoBot } from "../../Bot";
import { ComponentInteractionDataModel } from "../../struct/apliko/ComponentInteractionData";
import { ActionRow, Component, ComponentType, PageContent } from "../../struct";

export abstract class PanelPage implements CallbackHandler {
  private _bot: AplikoBot;

  public buttonCallbacks: Map<
    string,
    (context: ButtonInteractionContext) => Promise<any>
  >;
  public selectCallbacks: Map<
    string,
    (context: SelectMenuInteractionContext) => Promise<any>
  >;

  public constructor(bot: AplikoBot) {
    this._bot = bot;
    this.buttonCallbacks = new Map();
    this.selectCallbacks = new Map();
  }

  public async constructPage(context: PanelContext): Promise<PageContent> {
    return {
      embeds: [
        <AplikoEmbed>{
          style: AplikoEmbedStyle.ERROR,
          description: "Page not configured.",
        },
      ],
      components: [],
    };
  }

  public async onButton(
    context: PanelButtonInteractionContext,
    data: ComponentInteractionDataModel
  ) {
    this.buttonCallbacks.get(data.componentId)?.apply(this, [context]);
  }

  public async onSelect(
    context: PanelSelectMenuInteractionContext,
    data: ComponentInteractionDataModel
  ) {
    this.selectCallbacks.get(data.componentId)?.apply(this, [context]);
  }

  get bot() {
    return this._bot;
  }
}
