import { ApiInteractButton, InteractButtonStyle, ApiLinkButton, ApiButton } from '../api/ApiButton';
import { Component } from './Component';
export declare abstract class Button<T extends ApiButton> extends Component<T> {
    protected constructor();
    abstract label(value: string): any;
    abstract emoji(value: string): any;
    abstract disabled(value: boolean): any;
}
export declare class InteractButton extends Button<ApiInteractButton> {
    private constructor();
    static new(id?: string): InteractButton;
    label(value: string): InteractButton;
    emoji(value: string): InteractButton;
    disabled(value: boolean): InteractButton;
    id(value: string): InteractButton;
    style(value: InteractButtonStyle): InteractButton;
}
export declare class LinkButton extends Button<ApiLinkButton> {
    private constructor();
    static new(): LinkButton;
    label(value: string): LinkButton;
    emoji(value: string): LinkButton;
    disabled(value: boolean): LinkButton;
    url(value: string): LinkButton;
}
