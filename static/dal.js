
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
        host: config.db_cloud.host,
        user: config.db_cloud.user,
        password: config.db_cloud.password,
        database: config.db_cloud.database,
        ssl: true
    }
})

async function create_table_if_not_exist() {
    const tableExists = await connectedKnex.schema.hasTable('CHAT');

    if (!tableExists) {
      await connectedKnex.schema.createTable('CHAT', (table) => {
        table.increments('ID').primary(); // This creates a SERIAL column
        table.string('NAME').notNullable();
        table.timestamp('TIME').notNullable();
        table.string('message', 550);
      
      });
    }

}

async function create_table(){
    await create_table_if_not_exist()
}
create_table()

async function delete_all() {
    // db.run('update chat ....')
    const result = await connectedKnex('CHAT').del()
    await connectedKnex.raw('ALTER SEQUENCE "CHAT_ID_seq" RESTART WITH 1');
    return result    
}

async function get_all() {
    // db.run('select * from chat')
    const users = await connectedKnex('CHAT').select('*')
    return users
}

async function get_by_id(id) {
    // db.run('select * from company where id=?')
    const user = await connectedKnex('CHAT').select('*').where('ID', id).first()
    return user
}
async function new_message(new_user_message) {
    console.log("new userName",new_userName); // לבדוק מה באמת מתקבל
    const result = await connectedKnex('CHAT').insert(new_user_message);
    return { ...new_user_message, ID: result[0] }
}

async function update_user(id, updated_user) {
    // db.run('update company ....')
    const result = await connectedKnex('CHAT').where('ID', id).update(updated_user)
    return updated_user
}

async function delete_user(id) {
    // db.run('update company ....')
    const result = await connectedKnex('CHAT').where('ID', id).del()
    return result
}

module.exports = {
    get_all, get_by_id, new_message, update_user, delete_user, 
    delete_all, create_table_if_not_exist
}