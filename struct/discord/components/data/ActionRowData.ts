import { ComponentType } from "../enum/ComponentType";
import { Component } from "./Component";

export interface ActionRowData extends Component<ComponentType.ACTION_ROW> {

    components: Component<ComponentType>[];
    
}