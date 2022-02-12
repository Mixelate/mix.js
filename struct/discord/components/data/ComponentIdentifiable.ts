import { ComponentType } from "../enum/ComponentType";
import { Component } from "./Component";

export interface ComponentIdentifiable<T extends ComponentType> extends Component<T> {
    
    custom_id: string

}