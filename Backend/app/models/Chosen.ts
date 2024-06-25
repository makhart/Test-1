import { BaseModel, column, belongsTo } from "@adonisjs/lucid/orm"
import type { BelongsTo } from "@adonisjs/lucid/types/relations"
import Poll from "#models/Poll"
import Answer from "#models/Answer"

export default class Chosen extends BaseModel
{
    public static table = "chosen"

    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: "pollId" })
    declare pollId: number

    @belongsTo(() => Poll, { foreignKey: "pollId" })
    declare poll: BelongsTo<typeof Poll>

    @column({ columnName: "answerId" })
    declare answerId: number

    @belongsTo(() => Answer, { foreignKey: "answerId" })
    declare answer: BelongsTo<typeof Answer>
}
