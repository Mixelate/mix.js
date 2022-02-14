import { ButtonStyle } from "../enum/ButtonStyle";
import { ComponentType } from "../enum/ComponentType";
import { ApiBaseButton, ApiInteractButton, InteractButtonStyle, ApiLinkButton } from "../api/ApiButton";
import { JsonSerializable } from "../../../JsonSerializable";

export abstract class Button<T extends ApiBaseButton> implements JsonSerializable {
    
    protected data: T;

    constructor(data: T) {
        this.data = data;
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

    public toJSON(): T {
        return this.data;
    }
}

export class InteractButton extends Button<ApiInteractButton> {

    public constructor(custom_id?: string) {
        super(<ApiInteractButton>{
            type: ComponentType.BUTTON,
            custom_id: custom_id || '',
            style: ButtonStyle.SECONDARY
        });
    }

    public setCustomId(value: string) {
        this.data.custom_id = value;
    }

    public setStyle(value: InteractButtonStyle) {
        this.data.style = value;
    }
}

export class LinkButton extends Button<ApiLinkButton> {

    public constructor(url?: string) {
        super(<ApiLinkButton>{
            label: '',
            type: ComponentType.BUTTON,
            url: url || '',
            style: ButtonStyle.LINK
        });
    }

    public setURL(value: string) {
        this.data.url = value;
    }
}