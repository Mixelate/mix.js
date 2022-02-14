import { JsonSerializable } from "../../../JsonSerializable";
import { TextFieldStyle } from "../enum/TextFieldStyle";
import { ApiTextField } from "../api/ApiTextField";
import { ComponentType } from "../enum";
import { Component } from "./Component";

export class TextField extends Component<ApiTextField> {

    constructor() {
        super(ComponentType.TEXT_FIELD);
    }

    public setCustomId(value: string): TextField {
        this.data.custom_id = value;
        return this;
    }

    public setStyle(value: TextFieldStyle): TextField {
        this.data.style = value;
        return this;
    }

    public setTitle(value: string): TextField {
        this.data.label = value;
        return this;
    }

    public setMinimumLength(value: number): TextField {
        this.data.min_length = value;
        return this;
    }

    public setMaximumLength(value: number): TextField {
        this.data.max_length = value;
        return this;
    }

    public setRequired(value: boolean): TextField {
        this.data.required = value;
        return this;
    }

    public setDefaultText(value: string): TextField {
        this.data.value = value;
        return this;
    }

    public setPlaceholder(value: string): TextField {
        this.data.placeholder = value;
        return this;
    }

}