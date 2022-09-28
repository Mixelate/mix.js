import { Message } from 'discord.js';
import { ButtonInteractionContext } from '../struct/context/ButtonInteractionContext';
import { DropdownInteractionContext } from '../struct/context/DropdownInteractionContext';
import { ModalInteractionContext } from '../struct/context/ModalInteractionContext';

import {
    ButtonCallbacks,
    LoadCallbacks,
    MessageCallbacks,
    ModalCallbacks,
    SelectCallbacks,
    StopCallbacks,
} from './DecoratorSymbols';

export interface CallbackHandler {
    loadCallbacks?: (() => Promise<any>)[];
    stopCallbacks?: (() => Promise<any>)[];
    buttonCallbacks?: Map<string, (context: ButtonInteractionContext) => Promise<any>>;
    dropdownCallbacks?: Map<string, (context: DropdownInteractionContext) => Promise<any>>;
    messageCallbacks?: ((message: Message) => Promise<any>)[];
    modalCallbacks?: Map<string, (context: ModalInteractionContext) => Promise<any>>;
}

export type CallbackHandlerConstructor = {
    new (...args: any[]): CallbackHandler;
};

export function RegisterCallbacks<T extends CallbackHandlerConstructor>(Class: T) {
    return class extends Class {
        constructor(...args: any[]) {
            super(...args);
            const loadCallbacks = Class.prototype[LoadCallbacks];
            const stopCallbacks = Class.prototype[StopCallbacks];
            const buttonCallbacks = Class.prototype[ButtonCallbacks];
            const selectCallbacks = Class.prototype[SelectCallbacks];
            const messageCallbacks = Class.prototype[MessageCallbacks];
            const modalCallbacks = Class.prototype[ModalCallbacks];

            if (this.loadCallbacks && loadCallbacks) for (const callback of loadCallbacks) this.loadCallbacks.push(callback);

            if (this.stopCallbacks && stopCallbacks) for (const callback of stopCallbacks) this.stopCallbacks.push(callback);

            if (this.buttonCallbacks && buttonCallbacks) for (const [customId, callback] of buttonCallbacks) this.buttonCallbacks.set(customId, callback);

            if (this.dropdownCallbacks && selectCallbacks) for (const [customId, callback] of selectCallbacks) this.dropdownCallbacks.set(customId, callback);

            if (this.messageCallbacks && messageCallbacks) for (const callback of messageCallbacks) this.messageCallbacks.push(callback);

            if (this.modalCallbacks && modalCallbacks) for (const [customId, callback] of modalCallbacks) this.modalCallbacks.set(customId, callback);
        }
    };
}
