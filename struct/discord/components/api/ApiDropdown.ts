import { Identifiable } from "../../Identifiable";
import { ComponentType } from "../enum/ComponentType";
import { ApiComponent } from "./ApiComponent";

export interface ApiDropdownOption {

    label: string

    value?: string

    description?: string

    emoji?: string

    default?: boolean

}

export interface ApiDropdown extends ApiComponent<ComponentType.DROPDOWN>, Identifiable {

    options: ApiDropdownOption[]

    placeholder?: string

    disabled?: boolean

}

export type DropdownMaxValues = number | 'MAX'

export interface ApiMultiSelectDropdown extends ApiDropdown {

    min_values?: number

    max_values: DropdownMaxValues

}

export function IsMultiSelectDropdownData(dropdown: ApiDropdown): dropdown is ApiMultiSelectDropdown {
    return 'max_values' in dropdown
}