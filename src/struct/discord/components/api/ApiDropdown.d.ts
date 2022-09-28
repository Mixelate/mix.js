import { Identifiable } from '../../Identifiable';
import { ComponentType } from '../enum/ComponentType';
import { ApiComponent } from './ApiComponent';
export interface ApiDropdownOption {
    label: string;
    value?: string;
    description?: string;
    emoji?: string;
    default?: boolean;
}
export interface ApiDropdown extends ApiComponent<ComponentType.DROPDOWN>, Identifiable {
    options: ApiDropdownOption[];
    placeholder?: string;
    disabled?: boolean;
}
export declare type DropdownMaxValues = number | 'MAX';
export interface MultiSelectDropdownData extends ApiDropdown {
    min_values?: number;
    max_values: DropdownMaxValues;
}
export declare function IsApiDropdown(component: ApiComponent<ComponentType>): component is ApiDropdown;
export declare function IsApiMultiSelectDropdown(dropdown: ApiDropdown): dropdown is MultiSelectDropdownData;
