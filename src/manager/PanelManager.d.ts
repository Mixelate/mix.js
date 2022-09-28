import { Interaction } from 'discord.js';
import { BaseInteraction, Client, PanelPage } from '..';
import { PanelContext } from '../struct/application/panel/PanelContext';
import { RespondableInteraction } from '../util/discord/DiscordTypes';
export declare type PanelPageClass = {
    new (...args: any[]): PanelPage;
};
export declare class PanelManager {
    private client;
    private panelPageCache;
    private panelContextCache;
    constructor(bot: Client);
    onInteractionCreate(interaction: Interaction): Promise<void>;
    onWSInteractionCreate(interaction: BaseInteraction): Promise<void>;
    openPanel(interaction: RespondableInteraction, pageClass: PanelPageClass): Promise<void>;
    openDynamicPanel(interaction: RespondableInteraction, page: PanelPage): Promise<import("discord-api-types").APIMessage | import("discord.js").Message<boolean> | undefined>;
    openDynamicPage(context: PanelContext, page: PanelPage): Promise<void>;
    openPage(context: PanelContext, pageClass: PanelPageClass): Promise<void>;
    refreshPage(context: PanelContext, disabled?: boolean): Promise<void>;
    registerPage(page: PanelPage): void;
}
