import { Client } from '..';
import { Controller } from '../struct/application/Controller';
export declare class ControllerManager {
    private client;
    private controllersInit;
    private controllerMap;
    constructor(client: Client);
    private onReady;
    private onInteractionCreate;
    private onMessageCreate;
    registerControllers(...controllers: Controller[]): Promise<void>;
    clearChannelControllers(channelId: string): void;
}
