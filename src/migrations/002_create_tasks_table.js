export const up = function(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.enu('status', ['pending', 'in_progress', 'done']).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Ensure title is unique per user
    table.unique(['user_id', 'title']);
    table.index('user_id');
  });
};

export const down = function(knex) {
  return knex.schema.dropTableIfExists('tasks');
};
