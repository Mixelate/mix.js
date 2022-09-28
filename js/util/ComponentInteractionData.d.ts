/// <reference types="nedb" />
export interface ComponentInteractionDataModel {
    id: string;
    componentId: string;
    data: string[];
    delete: boolean;
}
export interface ComponentInteractionData {
    componentId: string;
    data: string[];
}
export declare const ComponentInteractionData: import("nedb")<ComponentInteractionDataModel>;
export declare const GenerateComponentInteractionDataId: () => Promise<string>;
export declare const CreateComponentInteractionData: (input: ComponentInteractionData) => Promise<string>;
export declare const FetchComponentInteractionData: (id: string) => Promise<ComponentInteractionDataModel>;
