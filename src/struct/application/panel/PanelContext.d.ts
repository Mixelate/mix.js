import { PanelPage } from "./PanelPage";
import { ButtonInteractionContext } from "../../context/ButtonInteractionContext";
import { DropdownInteractionContext } from "../../context/DropdownInteractionContext";
import { ModalInteractionContext } from "../../context/ModalInteractionContext";
import { RespondableInteraction } from "../../../util/discord/DiscordTypes";
export interface PanelContext {
    interaction: RespondableInteraction;
    replyMessageId: string;
    currentPage: PanelPage;
}
export declare type PanelButtonInteractionContext = ButtonInteractionContext & {
    panelContext: PanelContext;
};
export declare type PanelDropdownInteractionContext = DropdownInteractionContext & {
    panelContext: PanelContext;
};
export declare type PanelModalInteractionContext = ModalInteractionContext & {
    panelContext: PanelContext;
};
