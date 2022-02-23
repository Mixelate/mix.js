import { AplikoEmbed } from "../../util";
import { ActionRow } from "../discord";

export interface PageContent {
  embeds: AplikoEmbed[];

  components: ActionRow[];
}
