import { ComponentType } from '../enum/ComponentType';
import { ApiComponent } from '../api/ApiComponent';
import { ApiActionRow } from '../api/ApiActionRow';
import { Component } from './Component';
export declare class ActionRow<T extends Component<ApiComponent<ComponentType>> = Component> extends Component<ApiActionRow<ApiComponent<ComponentType>>> {
    private constructor();
    static new<A extends Component<ApiComponent<ComponentType>>>(...components: (A | undefined)[]): ActionRow<A>;
    components(...components: (T | undefined)[]): ActionRow<T>;
    enable(): void;
    disable(): void;
}
