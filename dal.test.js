
const assert = require('assert')
const dal = require('./dal')

describe('Testing functionallity of the DAL' , () => {
    beforeEach(async () => {
        await dal.create_table_if_not_exist()
        await dal.delete_all()
        await dal.new_user({ 'NAME': 'Paul', 'TIME': 32, 'MESSAGE': 'HI', 'SALARY': 20000.00})  // Id: 1
        await dal.new_user({ 'NAME': 'Allen', 'TIME': 31, 'MESSAGE': 'HELLO', 'SALARY': 550000.00}) // Id: 2
        await dal.new_user({ 'NAME': 'Teddy', 'TIME': 30, 'MESSAGE': '123 TEST', 'SALARY': 19000.00}) // Id: 3
    }, 20000)

    it('get_all', async () => {
        const expected = 3
        const employees = await dal.get_all()
        const actual = employees.length
        console.log(actual);
        assert.strictEqual(expected, actual)
    }, 20000)

    it('get_by_id', async () => {
        const expected = 'Teddy'
        const employee_id_3 = await dal.get_by_id(3)
        const actual = employee_id_3.NAME
        console.log(actual);
        assert.strictEqual(expected, actual)
    })

    it('updated_employee', async () => {
        await dal.update_emplyee(3, { 'NAME': 'MOSHE', 'TIME': 30, 'MESSAGE': 'Chicago', 'SALARY': 19000.00})
        const expected = 'MOSHE'
        const employee_id_3 = await dal.get_by_id(3)
        const actual = employee_id_3.NAME
        console.log(actual);
        assert.strictEqual(expected, actual)
    })    

    it('delete_employee', async () => {
        await dal.delete_employee(3)
        const expected = undefined
        const employee_id_3 = await dal.get_by_id(3)
        assert.strictEqual(expected, employee_id_3)
    })        

    it('new_employee', async () => {
        await dal.new_employee({ 'NAME': 'Shuli', 'AGE': 22, 'ADDRESS': 'TEL AVIV', 'SALARY': 49000.00}) // Id: 4
        const expected = 'Shuli'
        const employee_id_4 = await dal.get_by_id(4)
        assert.strictEqual(expected, employee_id_4.NAME)
    })        

    
    // complete all other tests for all methods:
    // update_emplyee(id, updated_employee)
    // delete_employee(id)
    // new_employee(new_emp)
    // delete_all ?

})