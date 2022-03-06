import { AplikoDropdown } from '../../../util/conversion/AplikoComponent';
import { QuestionnaireQuestion } from './QuestionnaireQuestion';

export interface QuestionnaireSelectQuestion extends QuestionnaireQuestion {
    selectMenu: AplikoDropdown;
}

export const IsQuestionnaireSelectQuestion = (questionnaireQuestion: QuestionnaireQuestion): questionnaireQuestion is QuestionnaireSelectQuestion => 'selectMenu' in questionnaireQuestion;
