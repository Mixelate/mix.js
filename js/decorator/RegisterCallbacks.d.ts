import { Message } from 'discord.js';
import { ButtonInteractionContext } from '../struct/context/ButtonInteractionContext';
import { DropdownInteractionContext } from '../struct/context/DropdownInteractionContext';
import { ModalInteractionContext } from '../struct/context/ModalInteractionContext';
export interface CallbackHandler {
    loadCallbacks?: (() => Promise<any>)[];
    stopCallbacks?: (() => Promise<any>)[];
    buttonCallbacks?: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    dropdownCallbacks?: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
    messageCallbacks?: ((message: Message) => Promise<any>)[];
    modalCallbacks?: Map<string, (context: ModalInteractionContext) => Promise<any>>;
}
export declare type CallbackHandlerConstructor = {
    new (...args: any[]): CallbackHandler;
};
export declare function RegisterCallbacks<T extends CallbackHandlerConstructor>(Class: T): {
    new (...args: any[]): {
        loadCallbacks?: (() => Promise<any>)[] | undefined;
        stopCallbacks?: (() => Promise<any>)[] | undefined;
        buttonCallbacks?: Map<string, (context: ButtonInteractionContext) => Promise<any>> | undefined;
        dropdownCallbacks?: Map<string, (context: DropdownInteractionContext) => Promise<any>> | undefined;
        messageCallbacks?: ((message: Message<boolean>) => Promise<any>)[] | undefined;
        modalCallbacks?: Map<string, (context: ModalInteractionContext) => Promise<any>> | undefined;
    };
} & T;
