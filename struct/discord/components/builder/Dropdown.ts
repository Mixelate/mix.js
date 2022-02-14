import { JsonSerializable } from "../../../JsonSerializable";
import { ApiDropdown, DropdownMaxValues, ApiDropdownOption, IsMultiSelectDropdownData, ApiMultiSelectDropdown } from "../api/ApiDropdown";

export class DropdownOption implements JsonSerializable {

    protected data: ApiDropdownOption

    constructor() {
        this.data = {
            label: '',            
        };
    }

    public setLabel(value: string) {
        this.data.label = value;
    }

    public setValue(value: string) {
        this.data.value = value;
    }

    public setDescription(value: string) {
        this.data.description = value;
    }

    public setEmoji(value: string) {
        this.data.emoji = value;
    }

    public setDefault(value: boolean) {
        this.data.default = value
    }

    public toJSON(): ApiDropdownOption {
        // TODO: Validator
        if (!this.data.value)
            this.data.value = this.data.label

        return this.data
    }
}

export abstract class Dropdown<T extends ApiDropdown = ApiDropdown> implements JsonSerializable {

    protected data: T;

    constructor(data: T) {
        this.data = data;
    }

    public setCustomId(value: string): Dropdown {
        this.data.custom_id = value;
        return this;
    }

    public addOptions(...options: DropdownOption[]): Dropdown {
        this.data.options.push(...options.map(option => option.toJSON()));
        return this;
    }

    public setPlaceholder(value: string): Dropdown {
        this.data.placeholder = value;
        return this;
    }

    public setDisabled(value: boolean): Dropdown {
        this.data.disabled = value;
        return this;
    }

    public toJSON(): T {
        //TODO: Validator
        if (IsMultiSelectDropdownData(this.data))
            if (this.data.max_values == 'MAX')
                this.data.max_values = this.data.options.length;

        return this.data;
    }

}

export class SingleSelectDropdown extends Dropdown<ApiDropdown> {}

export class MultiSelectDropdown extends Dropdown<ApiMultiSelectDropdown> {

    constructor() {
        super(<ApiMultiSelectDropdown>{
            max_values: "MAX"
        })
    }

    public setMinimumSelections(value: number): MultiSelectDropdown {
        this.data.min_values = value;
        return this;
    }

    public setMaximumSelections(value: DropdownMaxValues): MultiSelectDropdown {
        this.data.max_values = value;
        return this;
    }

}