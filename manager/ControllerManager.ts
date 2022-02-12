import { Interaction, Message } from "discord.js";
import { Controller } from "../application/Controller"
import { AplikoBot } from "../Bot"

export class ControllerManager {

    private bot: AplikoBot;
    private controllersInit: boolean;
    private controllerMap: Map<string, Controller>;

    constructor(bot: AplikoBot) {
        this.bot = bot;
        this.controllersInit = false;
        this.controllerMap = new Map();

        this.bot.client.on('ready', this.onReady.bind(this));
        this.bot.client.on('interactionCreate', this.onInteractionCreate.bind(this));
        this.bot.client.on('messageCreate', this.onMessageCreate.bind(this));
    }

    private async onReady() {
        this.controllerMap.forEach(channelController => channelController.load());
        this.controllersInit = true
    }

    private async onInteractionCreate(interaction: Interaction) {
        if (!interaction.isMessageComponent()) return;

       const controller = this.controllerMap.get(interaction.channelId);

       if (!controller) return;

       if (!controller.loaded) await controller.load();

       controller.onInteractionCreate(interaction);
    }

    private async onMessageCreate(message: Message) {
        const controller = this.controllerMap.get(message.channelId)

        if (!controller) return;

        if (!controller.loaded) await controller.load();

        controller.onMessageCreate(message);
    }

    public async registerControllers(...controllers: Controller[]) {
        for (const controller of controllers) {
            if (this.controllersInit) await controller.load();
            this.controllerMap.set(controller.channelId, controller);
        }
    }

    public clearChannelControllers(channelId: string) {
        this.controllerMap.delete(channelId);
    }

}