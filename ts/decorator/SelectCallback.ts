import { SelectMenuInteraction } from 'discord.js';
import { DropdownInteractionContext } from '../struct/context/DropdownInteractionContext';
import { SelectCallbacks, CALLBACK_WILDCARD } from './DecoratorSymbols';

export const DropdownCallback =
    (customId: string = CALLBACK_WILDCARD) =>
    (target: any, _: string, descriptor: PropertyDescriptor) => {
        target[SelectCallbacks] = target[SelectCallbacks] || new Map<string, (context: DropdownInteractionContext) => Promise<any>>();
        target[SelectCallbacks].set(customId, descriptor.value!);
    };
