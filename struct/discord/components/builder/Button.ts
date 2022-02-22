import { ButtonStyle } from "../enum/ButtonStyle";
import { ComponentType } from "../enum/ComponentType";
import {
  ApiBaseButton,
  ApiInteractButton,
  InteractButtonStyle,
  ApiLinkButton,
  ApiButton,
} from "../api/ApiButton";
import { JsonSerializable } from "../../../JsonSerializable";
import { Component } from "./Component";

export abstract class Button<T extends ApiButton> extends Component<T> {
  protected constructor() {
    super(ComponentType.BUTTON);
  }

  public abstract label(value: string);

  public abstract emoji(value: string);

  public abstract disabled(value: boolean);
}

export class InteractButton extends Button<ApiInteractButton> {
  private constructor() {
    super();
  }

  public static new(id?: string): InteractButton {
    return new InteractButton().id(id || '');
  }

  public label(value: string): InteractButton {
    this.data.label = value;
    return this;
  }

  public emoji(value: string): InteractButton {
    this.data.emoji = value;
    return this;
  }

  public disabled(value: boolean): InteractButton {
    this.data.disabled = value;
    return this;
  }

  public id(value: string): InteractButton {
    this.data.custom_id = value;
    return this;
  }

  public style(value: InteractButtonStyle): InteractButton {
    this.data.style = value;
    return this;
  }
}

export class LinkButton extends Button<ApiLinkButton> {
  private constructor() {
    super();
    this.data.style = ButtonStyle.LINK;
  }

  public static new(): LinkButton {
    return new LinkButton();
  }

  public label(value: string): LinkButton {
    this.data.label = value;
    return this;
  }

  public emoji(value: string): LinkButton {
    this.data.emoji = value;
    return this;
  }

  public disabled(value: boolean): LinkButton {
    this.data.disabled = value;
    return this;
  }

  public url(value: string): LinkButton {
    this.data.url = value;
    return this;
  }
}
