import { ButtonStyle } from "../enum/ButtonStyle";
import { ComponentType } from "../enum/ComponentType";
import { ApiBaseButton, ApiInteractButton, InteractButtonStyle, ApiLinkButton, ApiButton } from "../api/ApiButton";
import { JsonSerializable } from "../../../JsonSerializable";
import { Component } from "./Component";

export abstract class Button<T extends ApiButton> extends Component<T> {
    
    constructor() {
        super(ComponentType.BUTTON);
    }

    public setLabel(value: string) {
        this.data.label = value;
    }

    public setEmoji(value: string) {
        this.data.emoji = value;
    }

    public setDisabled(value: boolean) {
        this.data.disabled = value;
    }
}

export class InteractButton extends Button<ApiInteractButton> {

    public setCustomId(value: string) {
        this.data.custom_id = value;
    }

    public setStyle(value: InteractButtonStyle) {
        this.data.style = value;
    }
}

export class LinkButton extends Button<ApiLinkButton> {

    public constructor() {
        super();
        this.data.style = ButtonStyle.LINK;
    }

    public setURL(value: string) {
        this.data.url = value;
    }
}