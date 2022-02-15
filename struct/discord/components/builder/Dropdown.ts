import { JsonSerializable } from "../../../JsonSerializable";
import {
  ApiDropdown,
  DropdownMaxValues,
  ApiDropdownOption,
  IsApiMultiSelectDropdown,
  MultiSelectDropdownData,
} from "../api/ApiDropdown";
import { ComponentType } from "../enum";
import { Component } from "./Component";

export class DropdownOption implements JsonSerializable {
  protected data: ApiDropdownOption;

  private constructor() {
    this.data = {
      label: "",
    };
  }

  public static new(): DropdownOption {
    return new DropdownOption();
  }

  public label(value: string) {
    this.data.label = value;
  }

  public value(value: string) {
    this.data.value = value;
  }

  public description(value: string) {
    this.data.description = value;
  }

  public emoji(value: string) {
    this.data.emoji = value;
  }

  public default(value: boolean) {
    this.data.default = value;
  }

  public toJSON(): ApiDropdownOption {
    // TODO: Validator
    if (!this.data.value) this.data.value = this.data.label;

    return this.data;
  }
}

export abstract class Dropdown<
  T extends ApiDropdown = ApiDropdown
> extends Component<T> {
  protected constructor() {
    super(ComponentType.DROPDOWN);
  }

  public customId(value: string): Dropdown {
    this.data.custom_id = value;
    return this;
  }

  public options(...options: DropdownOption[]): Dropdown {
    this.data.options.push(...options.map((option) => option.toJSON()));
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
    if (IsApiMultiSelectDropdown(this.data))
      if (this.data.max_values == "MAX")
        this.data.max_values = this.data.options.length;

    return this.data;
  }
}

export class SingleSelectDropdown extends Dropdown<ApiDropdown> {
  public static new(): SingleSelectDropdown {
    return new SingleSelectDropdown();
  }
}

export class MultiSelectDropdown extends Dropdown<MultiSelectDropdownData> {
  private constructor() {
    super();
    this.data.max_values = "MAX";
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
