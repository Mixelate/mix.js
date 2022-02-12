import { ComponentType } from "../enum/ComponentType";
import { TextFieldStyle } from "../enum/TextFieldStyle";
import { ComponentIdentifiable } from "./ComponentIdentifiable";

export interface TextFieldData extends ComponentIdentifiable<ComponentType.TEXT_INPUT> {

    style: TextFieldStyle

    label: string

    min_length?: number

    max_length?: number

    required?: boolean

    value?: string

    placeholder?: string

}