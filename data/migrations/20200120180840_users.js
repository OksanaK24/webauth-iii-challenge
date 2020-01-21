exports.up = async function(knex) {

    // await knex.schema.createTable("departments", (department) => {
    //     department.increments("id")
    //     department.string("department")
    //         .notNullable()
    //         .unique()
    // })

    await knex.schema.createTable("users", (users) => {
        users.increments("id")
        users.string("username")
          .notNullable()
          .unique()
        users.string("password")
          .notNullable()
        users.string("department")
          // .references("department")
          // .inTable("departments")
          // .onDelete("SET NULL")
          // .onUpdate("SET NULL")
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("users")
    // await knex.schema.dropTableIfExists("departments")
};
