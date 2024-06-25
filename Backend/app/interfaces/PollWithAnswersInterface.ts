import { DateTime } from "luxon"

export default interface PollWithAnswersInterface {
    id: number
    question: string
    from: DateTime
    to: DateTime
    answers: {
        id: number
        answer: string
    }[]
}
