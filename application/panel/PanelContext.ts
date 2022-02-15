import { PanelPageClass } from "../../manager";
import { RepliableInteraction } from "../../util/discord/DiscordTypes";
import {
  ButtonInteractionContext,
  SelectMenuInteractionContext,
} from "../../struct/apliko/Contexts";
import { PanelPage } from "./PanelPage";

export interface PanelContext {
  interaction: RepliableInteraction;
  replyMessageId: string;
  currentPage: PanelPage;
}

export interface PanelButtonInteractionContext
  extends ButtonInteractionContext {
  panelContext: PanelContext;
}

export interface PanelSelectMenuInteractionContext
  extends SelectMenuInteractionContext {
  panelContext: PanelContext;
}
