import { PanelPage } from "struct/application/panel/PanelPage";
import { RespondableInteraction } from "util/discord/DiscordTypes";
import ButtonInteractionContext from "../../context/ButtonInteractionContext";
import DropdownInteractionContext from "../../context/DropdownInteractionContext";
import ModalInteractionContext from "../../context/ModalInteractionContext";

export default interface PanelContext {
    interaction: RespondableInteraction;
    replyMessageId: string;
    currentPage: PanelPage;
}

export type PanelButtonInteractionContext = ButtonInteractionContext & {
    panelContext: PanelContext;
}

export type PanelDropdownInteractionContext = DropdownInteractionContext & {
    panelContext: PanelContext;
}

export type PanelModalInteractionContext = ModalInteractionContext & {
    panelContext: PanelContext;
}