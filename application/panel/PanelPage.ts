import { AplikoEmbed } from "../../util/conversion/AplikoEmbed";
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

export class PanelPage implements CallbackHandler {
  private _bot: AplikoBot;
  private readonly _embeds: AplikoEmbed[];
  private readonly _components: AplikoComponent[][];

  public buttonCallbacks: Map<
    string,
    (context: ButtonInteractionContext) => Promise<any>
  >;
  public selectCallbacks: Map<
    string,
    (context: SelectMenuInteractionContext) => Promise<any>
  >;

  constructor(
    bot: AplikoBot,
    embeds: AplikoEmbed[],
    components: AplikoComponent[][]
  ) {
    this._bot = bot;
    this._embeds = embeds;
    this._components = components;
    this.buttonCallbacks = new Map();
    this.selectCallbacks = new Map();
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

  get embeds(): AplikoEmbed[] {
    return this._embeds;
  }

  get components(): AplikoComponent[][] {
    return this._components;
  }
}
