import { JsonSerializable } from "../../../JsonSerializable";
import { ApiComponent } from "../api";
import { ComponentType } from "../enum";

export abstract class Component<
  T extends ApiComponent<ComponentType> = ApiComponent
> implements JsonSerializable
{
  protected data: T;

  protected constructor(type: ComponentType) {
    this.data = <T>{
      type,
    };
  }

  public toJSON(): T {
    return this.data;
  }
}
