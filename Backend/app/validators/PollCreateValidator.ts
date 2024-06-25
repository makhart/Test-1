import vine from "@vinejs/vine"

export const PollCreateValidator = vine.compile(
    vine.object({
        question: vine
            .string()
            .minLength(5)
            .maxLength(50)
            .regex(new RegExp("^[\\p{L}\\p{N}\\p{Z}\\p{P}\\p{S}]{5,50}$", "u")),
        from: vine
            .date({ formats: ["YYYY-MM-DDTHH:mm", "x"] }),
        to: vine
            .date({ formats: ["YYYY-MM-DDTHH:mm", "x"] }),
        answers: vine.array(
            vine.object({
                answer: vine
                    .string()
                    .minLength(5)
                    .maxLength(50)
                    .regex(new RegExp("^[\\p{L}\\p{N}\\p{Z}\\p{P}\\p{S}]{5,50}$", "u")),
            })
        )
    })
)
