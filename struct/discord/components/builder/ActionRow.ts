import { JsonSerializable } from "../../../JsonSerializable";
import { ComponentType } from "../enum/ComponentType";
import { ApiComponent } from "../api/ApiComponent";
import { ApiActionRow } from "../api/ApiActionRow";
import { Component } from "./Component";

export class ActionRow<T extends Component<ApiComponent<ComponentType>>> extends Component<ApiActionRow<ApiComponent<ComponentType>>> {

    public constructor() {
        super(ComponentType.ACTION_ROW);
    }

    public addComponents(...components: T[]): ActionRow<T> {
        if (!this.data.components)
            this.data.components = []
            
        this.data.components.push(...components.map(component => component.toJSON()));
        return this;
    }

    public setComponents(components: T[]): ActionRow<T> {
        this.data.components = components.map(component => component.toJSON());
        return this;
    }

}