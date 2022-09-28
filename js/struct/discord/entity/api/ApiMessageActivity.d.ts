import { MessageActivityType } from "../enum/MessageActivityType";
export interface ApiMessageActivity {
    type: MessageActivityType;
    party_id?: string;
}
