import { ButtonInteraction } from 'discord.js';
import { ModalInteractionContext } from '../struct/context/ModalInteractionContext';
import { ThrowError } from '../util/Errors';
import { GetParameterNames } from '../util/Reflection';
import { ButtonCallbacks, CALLBACK_WILDCARD, ModalCallbacks } from './DecoratorSymbols';

export const ModalCallback =
    (customId: string = CALLBACK_WILDCARD) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        target[ModalCallbacks] = target[ModalCallbacks] || new Map<string, (context: ModalInteractionContext) => Promise<any>>();
        target[ModalCallbacks].set(customId, descriptor.value);
    };
