import { Interaction } from "discord.js";
import { ValidationError } from "../../../error/ValidationError";
import { JsonSerializable } from "../../../JsonSerializable";
import { ActionRow, TextField } from "../../components";
import { ApiModalInteraction } from "../data";

export class ModalInteraction implements JsonSerializable {

    public _id: string = '';
    public _title: string = '';
    public _components: TextField[] = [];

    private constructor() {}

    public static new(): ModalInteraction {
        return new ModalInteraction();
    }

    public id(value: string): ModalInteraction{
        this._id = value;
        return this;
    }

    public title(value: string): ModalInteraction {
        this._title = value;
        return this;
    }

    public components(...components: TextField[]): ModalInteraction {
        this._components.push(...components);
        return this;
    }

    public toJSON(): any {
        if (!this._id)
            throw new ValidationError('Failed to validate modal interaction response: Falsy modal ID');

        if (!this._title)
            throw new ValidationError('Failed to validate modal interaction response: Falsy modal title');

        if (this._components.length == 0)
            throw new ValidationError('Failed to validate modal interaction response: No components provided');

        return {
            custom_id: this._id,
            title: this._title,
            //TODO: Restructure components to make this bit more typesafe
            components: this._components.map(component => ActionRow.new().components(component).toJSON())
        };
    }

}