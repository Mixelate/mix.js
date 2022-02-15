import { ColorResolvable } from "discord.js";
import { IsQuestionnaireSelectQuestion } from "./QuestionnaireSelectQuestion";

export interface QuestionnaireQuestion {
  key: string;
  question: string;
  maxResponseLength: number;
  color?: ColorResolvable;
  reviseButtonLabel?: string;
  reviseButtonEmoji?: string;
}
