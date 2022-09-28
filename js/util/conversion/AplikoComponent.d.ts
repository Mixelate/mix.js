import { EmojiIdentifierResolvable, MessageActionRow, MessageButtonStyleResolvable, MessageComponent } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
export interface AplikoBaseButton {
    emoji?: EmojiIdentifierResolvable;
    label: string;
}
export interface AplikoInteractButton extends AplikoBaseButton {
    customId: string;
    style: Exclude<MessageButtonStyleResolvable, 'LINK' | MessageButtonStyles>;
    disabled: boolean;
}
export declare function isAplikoInteractButton(aplikoComponent: AplikoComponent): aplikoComponent is AplikoInteractButton;
export interface AplikoLinkButton extends AplikoBaseButton {
    url: string;
}
export declare function isAplikoLinkButton(aplikoComponent: AplikoComponent): aplikoComponent is AplikoLinkButton;
export interface AplikoDropdown {
    customId: string;
    label: string;
    options: AplikoDropdownOption[];
    min?: number;
    max?: number;
}
export interface AplikoDropdownOption {
    title: string;
    emoji?: EmojiIdentifierResolvable;
    description?: string;
    value: string;
    default?: boolean;
}
export declare function isAplikoDropdown(aplikoComponent: AplikoComponent): aplikoComponent is AplikoDropdown;
export declare type AplikoComponent = AplikoInteractButton | AplikoLinkButton | AplikoDropdown;
export declare function AplikoBuildComponent(aplikoComponent: AplikoComponent): MessageComponent | undefined;
export declare function AplikoBuildComponentRows(...componentRows: AplikoComponent[][]): MessageActionRow[];
