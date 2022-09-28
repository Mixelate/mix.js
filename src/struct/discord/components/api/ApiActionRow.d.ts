import { ComponentType } from '../enum/ComponentType';
import { ApiComponent } from './ApiComponent';
export interface ApiActionRow<T extends ApiComponent<any>> extends ApiComponent<ComponentType.ACTION_ROW> {
    components: T[];
}
