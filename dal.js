
const knex = require('knex')
const config = require('config')

// const connectedKnex = knex({
//     client: 'pg',
//     version: '13',
//     connection: {
//         host: '127.0.0.1',
//         user: 'postgres',
//         password: 'admin',
//         database: 'postgres'
//     }
// })

// obj1.client = 'pg'
// obj1.version = 13
// obj1.connection = config.db
// const connectedKnex_ = knex(obj1)

const connectedKnex = knex({
    client: 'pg',
    version: '16',
    connection: {
        host: config.db_cloud_local.host,
        user: config.db_cloud_local.user,
        password: config.db_cloud_local.password,
        database: config.db_cloud_local.database,
        ssl: true
    }
})

async function create_table_if_not_exist() {
    const tableExists = await connectedKnex.schema.hasTable('CHAT');

    if (!tableExists) {
      await connectedKnex.schema.createTable('CHAT', (table) => {
        table.increments('ID').primary(); // This creates a SERIAL column
        table.string('NAME').notNullable();
        table.integer('TIME').notNullable();
        table.string('message', 50);
        table.decimal('SALARY');
      });
    }

}

async function create_table(){
    await create_table_if_not_exist()
}
create_table()

async function delete_all() {
    // db.run('update company ....')
    const result = await connectedKnex('COMPANY').del()
    await connectedKnex.raw('ALTER SEQUENCE "COMPANY_ID_seq" RESTART WITH 1');
    return result    
}

async function get_all() {
    // db.run('select * from company')
    const emplyees = await connectedKnex('COMPANY').select('*')
    return emplyees
}

async function get_by_id(id) {
    // db.run('select * from company where id=?')
    const emplyee = await connectedKnex('COMPANY').select('*').where('ID', id).first()
    return emplyee
}

async function new_employee(new_emp) {
    // db.run('insert into company ....')
    // result[0] will be the new ID given by the SQL
    // Insert into company values(....)
    const result = await connectedKnex('COMPANY').insert(new_emp)
    return { ...new_emp, ID: result[0] }
}

async function update_emplyee(id, updated_employee) {
    // db.run('update company ....')
    const result = await connectedKnex('COMPANY').where('ID', id).update(updated_employee)
    return updated_employee
}

async function delete_employee(id) {
    // db.run('update company ....')
    const result = await connectedKnex('COMPANY').where('ID', id).del()
    return result
}

module.exports = {
    get_all, get_by_id, new_employee, update_emplyee, delete_employee, 
    delete_all, create_table_if_not_exist
}