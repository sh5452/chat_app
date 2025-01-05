
const assert = require('assert')
const dal = require('./dal')



const now = new Date();
const time = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

describe('Testing functionallity of the DAL' , () => {
    beforeEach(async () => {
        await dal.create_table_if_not_exist()
        await dal.delete_all()
        await dal.new_user({ 'NAME': 'Paul', 'TIME': time, 'MESSAGE': 'HI'})  // Id: 1
        await dal.new_user({ 'NAME': 'Allen', 'TIME': time, 'MESSAGE': 'HELLO'}) // Id: 2
        await dal.new_user({ 'NAME': 'Teddy', 'TIME': time, 'MESSAGE': '123 TEST'}) // Id: 3
    }, 20000)

    it('get_all', async () => {
        const expected = 3
        const users = await dal.get_all()
        const actual = users.length
        console.log(actual);
        assert.strictEqual(expected, actual)
    }, 20000)

    it('get_by_id', async () => {
        const expected = 'Teddy'
        const user_id_3 = await dal.get_by_id(3)
        const actual = user_id_3.NAME
        console.log(actual);
        assert.strictEqual(expected, actual)
    })

    it('updated_user', async () => {
        await dal.update_emplyee(3, { 'NAME': 'MOSHE', 'TIME': time, 'MESSAGE': 'hi everyone'})
        const expected = 'MOSHE'
        const user_id_3 = await dal.get_by_id(3)
        const actual = user_id_3.NAME
        console.log(actual);
        assert.strictEqual(expected, actual)
    })    

    it('delete_user', async () => {
        await dal.delete_user(3)
        const expected = undefined
        const user_id_3 = await dal.get_by_id(3)
        assert.strictEqual(expected, user_id_3)
    })        

    it('new_userName', async () => {
        await dal.new_user({ 'NAME': 'Shuli', 'TIME': time, 'MESSAGE': 'HELLO WORLD', }) // Id: 4
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