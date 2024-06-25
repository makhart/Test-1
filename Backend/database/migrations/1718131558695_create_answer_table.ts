import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'answer'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('answer', 50)
      table.integer('pollId').unsigned().references('id').inTable('poll')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}