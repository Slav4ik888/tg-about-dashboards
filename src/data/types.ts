
interface Response {
  text  : string
  image : string
  extra : string
}

export type QuestionType = 'single' | 'multiple'

export type QuestionAnswer = string

export interface Question {
  id        : number
  text      : string
  type      : QuestionType
  answers   : QuestionAnswer[]
  responses : {
    positive : Response
    negative : Response
  }
}
