
exports.up = function(knex) {
  return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.string("table_name").notNullable();
      table.integer("capacity").notNullable();
      table.string("status").defaultTo("Free").notNullable();
      table.integer("reservation_id").unsigned().references("reservations.reservation_id");
      table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("tables");
};
