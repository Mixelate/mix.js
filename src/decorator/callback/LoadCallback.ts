import { Message } from 'discord.js';
import { LoadCallbacks } from '../DecoratorSymbols';

export const LoadCallback = (target: any, _: string, descriptor: PropertyDescriptor) => {
    target[LoadCallbacks] = target[LoadCallbacks] || new Array<() => Promise<any>>();
    target[LoadCallbacks].push(descriptor.value!);
};
