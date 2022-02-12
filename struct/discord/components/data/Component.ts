import { ComponentType } from "../enum/ComponentType";

export interface Component<T extends ComponentType> {
    
    readonly type: T;

} 