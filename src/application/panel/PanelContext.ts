import { PanelPageClass } from '../..';
import { RespondableInteraction } from '../../util/discord/DiscordTypes';
import { ButtonInteractionContext, ModalInteractionContext, SelectMenuInteractionContext } from '../../struct/apliko/Contexts';
import { PanelPage } from './PanelPage';

export interface PanelContext {
    interaction: RespondableInteraction;
    replyMessageId: string;
    currentPage: PanelPage;
}

export interface PanelButtonInteractionContext extends ButtonInteractionContext {
    panelContext: PanelContext;
}

export interface PanelSelectMenuInteractionContext extends SelectMenuInteractionContext {
    panelContext: PanelContext;
}

export interface PanelModalInteractionContext extends ModalInteractionContext {
    panelContext: PanelContext;
}
