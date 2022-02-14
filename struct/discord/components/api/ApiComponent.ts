import { ComponentType } from "../enum/ComponentType";

export interface ApiComponent<T extends ComponentType = ComponentType> {
    
    readonly type: T;

} 