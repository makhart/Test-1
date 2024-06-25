import { BaseModel, column, belongsTo } from "@adonisjs/lucid/orm"
import type { BelongsTo } from "@adonisjs/lucid/types/relations"
import Poll from "#models/Poll"

export default class Answer extends BaseModel
{
    public static table = "answer"

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare answer: string

    @column({ columnName: "pollId" })
    declare pollId: number

    @belongsTo(() => Poll, { foreignKey: "pollId" })
    declare poll: BelongsTo<typeof Poll>
}
