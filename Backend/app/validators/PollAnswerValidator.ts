import vine from "@vinejs/vine"

export const PollAnswerValidator = vine.compile(
    vine.object({
        pollId: vine
            .number(),
        answerId: vine
            .number(),
    })
)
