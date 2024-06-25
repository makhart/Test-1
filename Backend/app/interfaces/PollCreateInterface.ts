export default interface PollCreateInterface {
    question: string
    from: Date
    to: Date
    answers: {
        answer: string
    }[]
}
