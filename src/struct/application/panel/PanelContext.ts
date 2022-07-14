import { PanelPage } from "../../../struct/application/panel/PanelPage";
import { ButtonInteractionContext } from "../../../struct/context/ButtonInteractionContext";
import { DropdownInteractionContext } from "../../../struct/context/DropdownInteractionContext";
import { ModalInteractionContext } from "../../../struct/context/ModalInteractionContext";
import { RespondableInteraction } from "../../../util/discord/DiscordTypes";

export interface PanelContext {
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