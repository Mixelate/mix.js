import { TextFieldStyle } from '../enum/TextFieldStyle';
import { ApiTextField } from '../api/ApiTextField';
import { Component } from './Component';
export declare class TextField extends Component<ApiTextField> {
    private constructor();
    static new(): TextField;
    customId(value: string): TextField;
    id(value: string): TextField;
    style(value: TextFieldStyle): TextField;
    title(value: string): TextField;
    minimumLength(value: number): TextField;
    maximumLength(value: number): TextField;
    required(value: boolean): TextField;
    defaultText(value: string): TextField;
    placeholder(value: string): TextField;
}
