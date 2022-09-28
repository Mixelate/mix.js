import { JsonSerializable } from '../../../misc/JsonSerializable';
import { ApiDropdown, DropdownMaxValues, ApiDropdownOption, MultiSelectDropdownData } from '../api/ApiDropdown';
import { Component } from './Component';
export declare class DropdownOption implements JsonSerializable {
    protected data: ApiDropdownOption;
    private constructor();
    static new(value?: string): DropdownOption;
    label(value: string): DropdownOption;
    value(value: string): DropdownOption;
    description(value: string): DropdownOption;
    emoji(value: string): DropdownOption;
    default(value: boolean): DropdownOption;
    toJSON(): ApiDropdownOption;
}
export declare abstract class Dropdown<T extends ApiDropdown = ApiDropdown> extends Component<T> {
    protected constructor();
    customId(value: string): Dropdown;
    options(...options: (DropdownOption | undefined)[]): Dropdown;
    placeholder(value: string): Dropdown;
    disabled(value: boolean): Dropdown;
    toJSON(): T;
}
export declare class SingleSelectDropdown extends Dropdown<ApiDropdown> {
    static new(id?: string): SingleSelectDropdown;
}
export declare class MultiSelectDropdown extends Dropdown<MultiSelectDropdownData> {
    private constructor();
    static new(): MultiSelectDropdown;
    minimumSelections(value: number): MultiSelectDropdown;
    maximumSelections(value: DropdownMaxValues): MultiSelectDropdown;
}
