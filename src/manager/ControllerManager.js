"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerManager = void 0;
class ControllerManager {
    constructor(client) {
        this.client = client;
        this.controllersInit = false;
        this.controllerMap = new Map();
        this.client.on('ready', this.onReady.bind(this));
        this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
        this.client.on('messageCreate', this.onMessageCreate.bind(this));
    }
    async onReady() {
        this.controllerMap.forEach((channelController) => channelController.load());
        this.controllersInit = true;
    }
    async onInteractionCreate(interaction) {
        if (!interaction.isMessageComponent())
            return;
        const controller = this.controllerMap.get(interaction.channelId);
        if (!controller)
            return;
        if (!controller.loaded)
            await controller.load();
        controller.onInteractionCreate(interaction);
    }
    async onMessageCreate(message) {
        const controller = this.controllerMap.get(message.channelId);
        if (!controller)
            return;
        if (!controller.loaded)
            await controller.load();
        controller.onMessageCreate(message);
    }
    async registerControllers(...controllers) {
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
    clearChannelControllers(channelId) {
        this.controllerMap.delete(channelId);
    }
}
exports.ControllerManager = ControllerManager;
