import { JsonSerializable } from "../../../JsonSerializable";
import { TextFieldStyle } from "../enum/TextFieldStyle";
import { ApiTextField } from "../api/ApiTextField";
import { ComponentType } from "../enum";
import { Component } from "./Component";

export class TextField extends Component<ApiTextField> {
  private constructor() {
    super(ComponentType.TEXT_FIELD);
  }

  public static new(): TextField {
    return new TextField();
  }

  public customId(value: string): TextField {
    this.data.custom_id = value;
    return this;
  }

  public style(value: TextFieldStyle): TextField {
    this.data.style = value;
    return this;
  }

  public title(value: string): TextField {
    this.data.label = value;
    return this;
  }

  public minimumLength(value: number): TextField {
    this.data.min_length = value;
    return this;
  }

  public maximumLength(value: number): TextField {
    this.data.max_length = value;
    return this;
  }

  public required(value: boolean): TextField {
    this.data.required = value;
    return this;
  }

  public defaultText(value: string): TextField {
    this.data.value = value;
    return this;
  }

  public placeholder(value: string): TextField {
    this.data.placeholder = value;
    return this;
  }
}
