import { JsonSerializable } from "../../../JsonSerializable";
import { ComponentType } from "../enum/ComponentType";
import { ApiComponent } from "../api/ApiComponent";
import { ApiActionRow } from "../api/ApiActionRow";

export class ActionRow implements JsonSerializable {

    private data: ApiActionRow<ApiComponent<ComponentType>>;

    public constructor() {
        this.data = {
            type: ComponentType.ACTION_ROW,
            components: []
        };
    }

    public addComponents(...components: ApiComponent<ComponentType>[]): ActionRow {
        this.data.components.push(...components);
        return this;
    }

    public setComponents(components: ApiComponent<ComponentType>[]): ActionRow {
        this.data.components = components;
        return this;
    }

    public toJSON(): ApiActionRow<ApiComponent<ComponentType>> {
        return this.data;
    }

}