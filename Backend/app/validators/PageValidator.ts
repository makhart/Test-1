import vine from "@vinejs/vine"

export const PageValidator = vine.compile(
    vine.object({
        page: vine
            .number()
            .min(1)
            .max(100)
    })
)
