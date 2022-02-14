import { Identifiable } from "../../Identifiable";
import { ComponentType } from "../enum/ComponentType";
import { TextFieldStyle } from "../enum/TextFieldStyle";
import { ApiComponent } from "./ApiComponent";

export interface ApiTextField extends ApiComponent<ComponentType.TEXT_FIELD>, Identifiable {

    style: TextFieldStyle

    label: string

    min_length?: number

    max_length?: number

    required?: boolean

    value?: string

    placeholder?: string

}

export interface ApiTextFieldResponse extends ApiComponent<ComponentType.TEXT_FIELD>, Identifiable {

    value: string

}