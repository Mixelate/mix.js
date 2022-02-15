import { SelectMenuInteraction } from "discord.js";
import { SelectMenuInteractionContext } from "../../struct/apliko/Contexts";
import { SelectCallbacks, CALLBACK_WILDCARD } from "../DecoratorSymbols";

export const SelectCallback =
  (customId: string = CALLBACK_WILDCARD) =>
  (target: any, _: string, descriptor: PropertyDescriptor) => {
    target[SelectCallbacks] =
      target[SelectCallbacks] ||
      new Map<
        string,
        (context: SelectMenuInteractionContext) => Promise<any>
      >();
    target[SelectCallbacks].set(customId, descriptor.value!);
  };
