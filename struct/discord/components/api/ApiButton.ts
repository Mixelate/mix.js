import { Identifiable } from "../../Identifiable";
import { ButtonStyle } from "../enum/ButtonStyle";
import { ComponentType } from "../enum/ComponentType";
import { ApiComponent } from "./ApiComponent";

export interface ApiBaseButton {
  label: string;

  emoji?: string;

  disabled?: boolean;
}

export type InteractButtonStyle = Exclude<ButtonStyle, ButtonStyle.LINK>;

export interface ApiInteractButton
  extends ApiBaseButton,
    ApiComponent<ComponentType.BUTTON>,
    Identifiable {
  style: InteractButtonStyle;
}

export type LinkButtonStyle = Omit<ButtonStyle, ButtonStyle.LINK>;

export interface ApiLinkButton
  extends ApiBaseButton,
    ApiComponent<ComponentType.BUTTON> {
  style: LinkButtonStyle;

  url: string;
}

export type ApiButton = ApiInteractButton | ApiLinkButton;

export function IsApiButton(
  component: ApiComponent<ComponentType>
): component is ApiButton {
  return component.type == ComponentType.BUTTON;
}

export function IsApiInteractButton(
  buttonData: ApiButton
): buttonData is ApiInteractButton {
  return !("url" in buttonData);
}

export function IsApiLinkButton(
  buttonData: ApiButton
): buttonData is ApiLinkButton {
  return "url" in buttonData;
}
