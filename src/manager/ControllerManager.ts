import { Client } from '..';
import { Interaction, Message } from 'discord.js';
import { Controller } from '../struct/application/Controller';

export class ControllerManager {
    private client: Client;
    private controllersInit: boolean;
    private controllerMap: Map<string, Controller>;

    constructor(client: Client) {
        this.client = client;
        this.controllersInit = false;
        this.controllerMap = new Map();

        this.client.on('ready', this.onReady.bind(this));
        this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
        this.client.on('messageCreate', this.onMessageCreate.bind(this));
    }

    private async onReady() {
        this.controllerMap.forEach((channelController) => channelController.load());
        this.controllersInit = true;
    }

    private async onInteractionCreate(interaction: Interaction) {
        if (!interaction.isMessageComponent()) return;

        const controller = this.controllerMap.get(interaction.channelId);

        if (!controller) return;

        if (!controller.loaded) await controller.load();

        controller.onInteractionCreate(interaction);
    }

    private async onMessageCreate(message: Message) {
        const controller = this.controllerMap.get(message.channelId);

        if (!controller) return;

        if (!controller.loaded) await controller.load();

        controller.onMessageCreate(message);
    }

    public async registerControllers(...controllers: Controller[]) {
        for (const controller of controllers) {
            const channel = await controller.getChannelInstance();

            if (!this.client.shouldHandleGuild(channel.guildId)) {
                console.log(`Attempted to register controller in an ignored guild\nClient ID: ${this.client.options.id}\nGuild ID: ${channel.guildId}\nChannel ID: ${channel.id}`);
                continue;
            }

            this.controllerMap.set(controller.channelId, controller);

            if (this.controllersInit)
                await controller.load();
        }
    }

    public clearChannelControllers(channelId: string) {
        this.controllerMap.delete(channelId);
    }
}
