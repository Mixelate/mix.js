import { JsonSerializable } from '../../../misc/JsonSerializable';
import { ApiComponent } from '../../../..';
import { ComponentType } from '../../../..';
export declare abstract class Component<T extends ApiComponent<ComponentType> = ApiComponent> implements JsonSerializable {
    protected data: T;
    protected constructor(type: ComponentType);
    toJSON(): T;
}
