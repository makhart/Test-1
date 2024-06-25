import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'poll'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('question', 50)
      table.datetime('from')
      table.datetime('to')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
