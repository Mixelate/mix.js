import { ButtonInteraction } from "discord.js";
import { ButtonInteractionContext } from "../../struct/apliko/Contexts";
import { ThrowError } from "../../util/Errors";
import { GetParameterNames } from "../../util/GetParameterNames";
import { ButtonCallbacks, CALLBACK_WILDCARD } from "../DecoratorSymbols";

export const ButtonCallback =
  (customId: string = CALLBACK_WILDCARD) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    target[ButtonCallbacks] =
      target[ButtonCallbacks] ||
      new Map<string, (context: ButtonInteractionContext) => Promise<any>>();
    target[ButtonCallbacks].set(customId, descriptor.value);
  };
