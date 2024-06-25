import vine from "@vinejs/vine"

export const PollChosenIdsValidator = vine.compile(
    vine.object({
        pollIds: vine.array(
            vine.number()
        )
    })
)
