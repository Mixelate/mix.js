import { JsonSerializable } from '../../../misc/JsonSerializable';
import { TextField } from '../../../..';
export declare class Modal implements JsonSerializable {
    _id: string;
    _title: string;
    _components: TextField[];
    private constructor();
    static new(): Modal;
    id(value: string): Modal;
    title(value: string): Modal;
    components(...components: (TextField | undefined)[]): Modal;
    toJSON(): any;
}
