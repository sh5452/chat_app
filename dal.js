
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
        ssl: config.db_cloud.ssl || true
    },
    pool: {
        min: 2,
        max: 5  // זה חשוב! אפילו 2-5 מספיקים לאפליקציה קטנה
      }
})

async function create_table_if_not_exist() {
    const tableExists = await connectedKnex.schema.hasTable('CHAT');

    if (!tableExists) {
      await connectedKnex.schema.createTable('CHAT', (table) => {
        table.increments('ID').primary(); // This creates a SERIAL column
        table.string('NAME').notNullable();
        table.timestamp('TIME').notNullable();
        table.string('MESSAGE', 550);
      
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
    console.log("Inserting to DB:", new_user_message);
    const result = await connectedKnex('CHAT')
        .insert(new_user_message)
        .returning('ID');

    const id = result?.[0]?.ID ?? null; // הגנה מפני מקרים לא צפויים

    console.log("Result from DB:", result);
    console.log("Returning ID:", id);

    return {
        ...new_user_message,
        ID: result[0].ID 
    };
}

async function update_message(id, updatedMessage) {
    const result = await connectedKnex('CHAT')
        .where('ID', id)
        .update(updatedMessage)
        .returning('*');
    return result[0];
}

async function delete_message(id) {
    console.log('מוחקת מה-DB ID:', id);

    const existing = await connectedKnex('CHAT').where('ID', id).first();
    if (!existing) return null;  // אם לא קיימת – אין מה למחוק

    await connectedKnex('CHAT').where('ID', id).del(); // מחיקה בפועל
    console.log('נמחק מה-DB:', existing);

    return existing; // מחזירה את ההודעה שנמחקה
}

module.exports = {
    get_all, get_by_id, new_message, update_message, delete_message, 
    delete_all, create_table_if_not_exist
}