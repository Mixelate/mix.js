import { JsonSerializable } from "../../../JsonSerializable";
import { ComponentType } from "../enum/ComponentType";
import { Component } from "../data/Component";
import { ActionRowData } from "../data/ActionRowData";

export class ActionRow implements JsonSerializable {

    private data: ActionRowData;

    public constructor() {
        this.data = {
            type: ComponentType.ACTION_ROW,
            components: []
        };
    }

    public addComponents(...components: Component<ComponentType>[]): ActionRow {
        this.data.components.push(...components);
        return this;
    }

    public setComponents(components: Component<ComponentType>[]): ActionRow {
        this.data.components = components;
        return this;
    }

    public toJSON(): any {
        return {
            ...this.data
        };
    }

}