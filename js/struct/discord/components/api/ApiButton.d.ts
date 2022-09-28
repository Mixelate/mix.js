import { Identifiable } from '../../Identifiable';
import { ButtonStyle } from '../enum/ButtonStyle';
import { ComponentType } from '../enum/ComponentType';
import { ApiComponent } from './ApiComponent';
export interface ApiBaseButton {
    label: string;
    emoji?: string;
    disabled?: boolean;
}
export declare type InteractButtonStyle = Exclude<ButtonStyle, ButtonStyle.LINK>;
export interface ApiInteractButton extends ApiBaseButton, ApiComponent<ComponentType.BUTTON>, Identifiable {
    style: InteractButtonStyle;
}
export declare type LinkButtonStyle = Omit<ButtonStyle, ButtonStyle.LINK>;
export interface ApiLinkButton extends ApiBaseButton, ApiComponent<ComponentType.BUTTON> {
    style: LinkButtonStyle;
    url: string;
}
export declare type ApiButton = ApiInteractButton | ApiLinkButton;
export declare function IsApiButton(component: ApiComponent<ComponentType>): component is ApiButton;
export declare function IsApiInteractButton(buttonData: ApiButton): buttonData is ApiInteractButton;
export declare function IsApiLinkButton(buttonData: ApiButton): buttonData is ApiLinkButton;
