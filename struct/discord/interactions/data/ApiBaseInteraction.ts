import { InteractionType } from "../enum";

export interface ApiBaseInteraction<T extends InteractionType> {
  readonly type: T;

  id: string;
  token: string;

  application_id: string;

  guild?: {
    id: string;
  };

  // TODO: Proper typings
  member?: {
    user: {
      id: string;
    };
  };

  channel_id: string;
}
