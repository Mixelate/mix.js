import { JsonSerializable } from '../../../misc/JsonSerializable';
import { ComponentType } from '../enum/ComponentType';
import { ApiComponent } from '../api/ApiComponent';
import { ApiActionRow } from '../api/ApiActionRow';
import { Component } from './Component';

export class ActionRow<T extends Component<ApiComponent<ComponentType>> = Component> extends Component<ApiActionRow<ApiComponent<ComponentType>>> {
    private constructor() {
        super(ComponentType.ACTION_ROW);
    }

    public static new<A extends Component<ApiComponent<ComponentType>>>(...components: (A | undefined)[]): ActionRow<A> {
        return new ActionRow<A>().components(...components);
    }

    public components(...components: (T | undefined)[]): ActionRow<T> {
        if (!this.data.components) this.data.components = [];
        this.data.components.push(...components.filter(component => component != undefined).map((component) => component!.toJSON()));
        return this;
    }
}
