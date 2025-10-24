

export type UserQuestionAnswer  = number | number[]
export type TempAnswers = any // number[] | null

export type UserAnswerType = 'positive' | 'negative'

export interface UserAnswer {
  questionId : number
  answer     : UserQuestionAnswer
  type       : UserAnswerType
}


export interface UserStateServiceType {
  currentQuestionIdx : number
  userAnswers        : UserAnswer[]
  showExtra          : boolean
  tempAnswers        : TempAnswers
  createdAt          : number
}
