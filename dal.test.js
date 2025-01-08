
const assert = require('assert')
const dal = require('./dal')


const now = new Date();
const time = now.toISOString().slice(0, 19).replace('T', ' ');

describe('Testing functionallity of the DAL' ,function (){
    this.timeout(5000); // הגדלת Timeout לכל הבדיקות בתוך describe
    beforeEach(async function() {
        console.log('Setting up test data...');

        await dal.create_table_if_not_exist()
        await dal.delete_all()
        await dal.new_user({ 'NAME': 'Paul', 'TIME': time, 'message': 'HI'})  // Id: 1
        await dal.new_user({ 'NAME': 'Allen', 'TIME': time, 'message': 'HELLO'}) // Id: 2
        await dal.new_user({ 'NAME': 'Teddy', 'TIME': time, 'message': '123 TEST'}) // Id: 3
        console.log('Test data setup complete.');
    })

    it('should fetch all users', async function(){
        const users = await dal.get_all();
        console.log(users);
        // בדוק את התוצאה
        if (!users || users.length !== 3) {
            throw new Error('Expected 3 users but got ' + (users ? users.length : 0));
        }
    });
//

    it('get_by_id', async function(){
        const expected = 'Teddy'
        const user_id_3 = await dal.get_by_id(3)
        const actual = user_id_3.NAME
        console.log(actual);
        assert.strictEqual(expected, actual)
    })

    it('updated_user', async function() {
        await dal.update_user(3, { 'NAME': 'MOSHE', 'TIME': time, 'message': 'hi everyone'})
        const expected = 'MOSHE'
        const user_id_3 = await dal.get_by_id(3)
        const actual = user_id_3.NAME
        console.log(actual);
        assert.strictEqual(expected, actual)
    })    

    it('delete_user', async function(){
        await dal.delete_user(3)
        const expected = undefined
        const user_id_3 = await dal.get_by_id(3)
        assert.strictEqual(expected, user_id_3)
    })        

    it('new_userName', async function(){
        await dal.new_user({ 'NAME': 'Shuli', 'TIME': time, 'message': 'HELLO WORLD', }) // Id: 4
        const expected = 'Shuli'
        const user_id_4 = await dal.get_by_id(4)
        assert.strictEqual(expected, user_id_4.NAME)
    })        

    
    // complete all other tests for all methods:
    // update_emplyee(id, updated_employee)
    // delete_employee(id)
    // new_employee(new_emp)
    // delete_all ?

})