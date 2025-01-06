const express=require('express')
const router=express.Router()
const dal=require('../dal')

//GET
router.get('/', async (request, response) => {
    try {
        const users = await dal.get_all()
        response.json(users)
    }
    catch (e) {
        logger.error(`Error during get_all ${JSON.stringify(e)}`)
        response.status(500).json( `error: ${JSON.stringify(e) }`)
    }
})


//GET BY ID
router.get('/:id', async (request, response) => {
    const user_id = parseInt(request.params.id)
    const user = await dal.get_by_id(user_id)
    if (user) {
        response.json(user)
    }
    else {
        logger.error(`Error during get/:id not found`)
        response.status(404).json({ "error": `cannot find user with id ${user_id}` })
    }
})
// POST
router.post('/', async (request, response) => {
    try {
        const new_userName = request.body
        const result = await dal.new_user(new_userName)
        response.status(201).json(result)
    }
    catch (e) {
        logger.error(`Error during post ${JSON.stringify(e)}`)
        response.status(400).json({ 'Error': e })
    }
})

// PUT
router.put('/:id', async (request, response) => {
    try {
        const user_id = parseInt(request.params.id)
        const user = await dal.get_by_id(user_id)
        if (user) {
            // user exists ==> perform update
            const updated_user_req = request.body
            const result = await dal.update_user(user_id, updated_user_req)
            response.status(200).json(updated_user_req)
        }
        else {
            // user does NOT exist ==> perform insert
            const new_userName = request.body
            const result = await dal.new_user(new_userName)
            response.status(201).json(result)
        }
    }
    catch (e) {
        logger.error(`Error during put ${JSON.stringify(e)}`)
        response.status(400).json({ 'Error': e })
    }
})
// PATCH
router.patch('/:id', async (request, response) => {
    try {
        const updated_user_req = request.body
        const user_id = parseInt(request.params.id)
        const user = await dal.get_by_id(user_id)
        // override only existing fields in the user from the db
        if (!user) {
            response.status(404).json({ "error": `cannot find user with id ${user_id}` })
            return
        }
        const result = await dal.update_user(user_id, { ...user, ...updated_user_req })
        response.status(200).json(result )
    }
    catch (e) {
        logger.error(`Error during patch ${JSON.stringify(e)}`)
        response.status(400).json({ 'Error': e })
    }
})

// DELETE
router.delete('/:id', async (request, response) => {
    try {
        const user_id = parseInt(request.params.id)
        const result = await dal.delete_user(user_id)
        response.status(204).json( result )
    }
    catch (e) {
        logger.error(`Error during delete ${JSON.stringify(e)}`)
        response.status(400).json({ 'Error': e })
    }
})

module.exports = router