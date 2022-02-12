import { Questionnaire } from "./Questionnaire"
import { QuestionnaireQuestion } from "./QuestionnaireQuestion"

export interface QuestionnaireContext {
    questionnaire: Questionnaire
    answers: string[]
    revising?: boolean
}