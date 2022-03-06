import { JsonSerializable } from '../../../JsonSerializable';
import { ApiDropdown, DropdownMaxValues, ApiDropdownOption, IsApiMultiSelectDropdown, MultiSelectDropdownData } from '../api/ApiDropdown';
import { ComponentType } from '../../../..';
import { Component } from './Component';

export class DropdownOption implements JsonSerializable {
    protected data: ApiDropdownOption;

    private constructor() {
        this.data = {
            label: ''
        };
    }

    public static new(value?: string): DropdownOption {
        return new DropdownOption().value(value || '');
    }

    public label(value: string): DropdownOption {
        this.data.label = value;
        return this;
    }

    public value(value: string): DropdownOption {
        this.data.value = value;
        return this;
    }

    public description(value: string): DropdownOption {
        this.data.description = value;
        return this;
    }

    public emoji(value: string): DropdownOption {
        this.data.emoji = value;
        return this;
    }

    public default(value: boolean): DropdownOption {
        this.data.default = value;
        return this;
    }

    public toJSON(): ApiDropdownOption {
        // TODO: Validator
        if (!this.data.value) this.data.value = this.data.label;

        return this.data;
    }
}

export abstract class Dropdown<T extends ApiDropdown = ApiDropdown> extends Component<T> {
    protected constructor() {
        super(ComponentType.DROPDOWN);
    }

    public customId(value: string): Dropdown {
        this.data.custom_id = value;
        return this;
    }

    public options(...options: (DropdownOption | undefined)[]): Dropdown {
        if (!this.data.options) this.data.options = [];

        this.data.options.push(...options.filter((option) => option != undefined).map((option) => option!.toJSON()));
        return this;
    }

    public placeholder(value: string): Dropdown {
        this.data.placeholder = value;
        return this;
    }

    public disabled(value: boolean): Dropdown {
        this.data.disabled = value;
        return this;
    }

    public override toJSON(): T {
        //TODO: Validator
        if (IsApiMultiSelectDropdown(this.data)) if (this.data.max_values == 'MAX') this.data.max_values = this.data.options.length;

        return this.data;
    }
}

export class SingleSelectDropdown extends Dropdown<ApiDropdown> {
    public static new(id?: string): SingleSelectDropdown {
        return new SingleSelectDropdown().customId(id || '');
    }
}

export class MultiSelectDropdown extends Dropdown<MultiSelectDropdownData> {
    private constructor() {
        super();
        this.data.max_values = 'MAX';
    }

    public static new(): MultiSelectDropdown {
        return new MultiSelectDropdown();
    }

    public minimumSelections(value: number): MultiSelectDropdown {
        this.data.min_values = value;
        return this;
    }

    public maximumSelections(value: DropdownMaxValues): MultiSelectDropdown {
        this.data.max_values = value;
        return this;
    }
}
