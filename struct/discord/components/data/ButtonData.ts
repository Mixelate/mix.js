import { ButtonStyle } from "../enum/ButtonStyle";
import { ComponentType } from "../enum/ComponentType";
import { Component } from "./Component";
import { ComponentIdentifiable } from "./ComponentIdentifiable";


export interface BaseButtonData  {

    label: string

    emoji?: string

    disabled?: boolean

}

export type InteractButtonStyle = Exclude<ButtonStyle, ButtonStyle.LINK>

export interface InteractButtonData extends BaseButtonData, ComponentIdentifiable<ComponentType.BUTTON> {

    style: InteractButtonStyle

}

export type LinkButtonStyle = Omit<ButtonStyle, ButtonStyle.LINK>

export interface LinkButtonData extends BaseButtonData, Component<ComponentType.BUTTON> {

    style: LinkButtonStyle

    url: string

}

export type ButtonData = InteractButtonData | LinkButtonData;

export function IsInteractButtonData(buttonData: ButtonData): buttonData is InteractButtonData {
    return !('url' in buttonData)
}

export function IsLinkButtonData(buttonData: ButtonData): buttonData is LinkButtonData {
    return 'url' in buttonData
}