import { Interaction } from "discord.js";
import { ValidationError } from "../../../error/ValidationError";
import { JsonSerializable } from "../../../JsonSerializable";
import { ActionRow, TextField } from "../../components";
import { ApiModalInteraction } from "../data";

export class ModalInteraction implements JsonSerializable {

    public interactionId: string = '';
    public interactionToken: string = '';
    public _id: string = '';
    public _title: string = '';
    public _components: TextField[] = [];

    private constructor() {}

    public replyingInteraction(interaction: Interaction): ModalInteraction {
        this.interactionId = interaction.id;
        this.interactionToken = interaction.token;
        return this;
    }

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
        if (!this.interactionId)
            throw new ValidationError('Failed to validate modal interaction response: Falsy interaction ID');

        if (!this.interactionToken)
            throw new ValidationError('Failed to validate modal interaction response: Falsy interaction token');

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
            components: this._components.map(component => 
                new ActionRow().addComponents(component).toJSON())
        };
    }

}