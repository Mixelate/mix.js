import { ComponentType } from "../enum/ComponentType";

export interface ApiComponent<T extends ComponentType> {
    
    readonly type: T;

} 