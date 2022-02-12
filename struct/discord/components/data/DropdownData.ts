import { ComponentType } from "../enum/ComponentType";
import { ComponentIdentifiable } from "./ComponentIdentifiable";

export interface DropdownOptionData {

    label: string

    value?: string

    description?: string

    emoji?: string

    default?: boolean

}

export interface DropdownData extends ComponentIdentifiable<ComponentType.DROPDOWN> {

    options: DropdownOptionData[]

    placeholder?: string

    disabled?: boolean

}

export type DropdownMaxValues = number | 'MAX'

export interface MultiSelectDropdownData extends DropdownData {

    min_values?: number

    max_values: DropdownMaxValues

}

export function IsMultiSelectDropdownData(dropdown: DropdownData): dropdown is MultiSelectDropdownData {
    return 'max_values' in dropdown
}