import { ButtonStyle } from "../enum/ButtonStyle";
import { ComponentType } from "../enum/ComponentType";
import { BaseButtonData, InteractButtonData, InteractButtonStyle, LinkButtonData } from "../data/ButtonData";
import { JsonSerializable } from "../../../JsonSerializable";

export abstract class Button<T extends BaseButtonData> implements JsonSerializable {
    
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

export class InteractButton extends Button<InteractButtonData> {

    public constructor(custom_id?: string) {
        super(<InteractButtonData>{
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

export class LinkButton extends Button<LinkButtonData> {

    public constructor(url?: string) {
        super(<LinkButtonData>{
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