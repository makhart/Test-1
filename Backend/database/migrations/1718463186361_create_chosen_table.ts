import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chosen'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('pollId').unsigned().references('id').inTable('poll')
      table.integer('answerId').unsigned().references('id').inTable('answer')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}