import { DateTime } from "luxon"
import { BaseModel, column, hasMany, manyToMany } from "@adonisjs/lucid/orm"
import type { HasMany } from "@adonisjs/lucid/types/relations"
import type { ManyToMany } from "@adonisjs/lucid/types/relations"
import Answer from "#models/Answer"

export default class Poll extends BaseModel
{
    public static table = "poll"

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare question: string

    @column.dateTime()
    declare from: DateTime

    @column.dateTime()
    declare to: DateTime

    @hasMany(() => Answer, {
        foreignKey: "pollId",
    })
    declare answers: HasMany<typeof Answer>

    @manyToMany(() => Answer, {
        localKey: "id",
        relatedKey: "id",
        pivotTable: "chosen",
        pivotForeignKey: "pollId",
        pivotRelatedForeignKey: "answerId"
    })
    declare chosen: ManyToMany<typeof Answer>
}
