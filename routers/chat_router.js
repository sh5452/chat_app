const express=require('express')
const router=express.Router()
const dal=require('../static/dal')
const logger=require('../logger/my_logger')

/** 
*components:
*  schemas:
*    Message:
*     type: object
*     required:
*        - id
*        - name
*        - time
*        - message
*      properties:
*        id:
*          type: number
*          description: The auto-generated id of the message.
*        name:
*          type: string
*          description: The name of the user.
*        time:
*          type: string
*          description: time of the message
*        message:
*          type: string
*          description: The message we write
*      example:
*        name: Kim
*        time: 2025-01-13 13:30:33
*        message: Hello everybody
*/


// GET 
/**
*  @swagger
*   /api/chat/:
*     get:
*       summary: List all of the messages
*responses:
 * 200:
 *   description: Successful response with the message details.
 *  content:
 *     application/json:
 *  schema:
 * $ref: '#/components/schemas/Message'
 */

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

/**
 * @swagger
 * /api/chat/{id}:
 *   get:
 *     summary: Get message by ID
 *     description: Retrieve message details based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the message to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the message details.
 *         content:
 *           application/json:
 *             example:
 *               id: 4
 *               name: shuli
 *               time: 2025-01-09 00:29:16
 *               message: HELLO WORLD
 *       404:
 *         description: Message not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: cannot find message with id {id}
 */


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


/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Create a new message
 *     description: Create a new message record with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               time:
 *                 type: string
 *                 description: The time of the message.
 *               message:
 *                 type: string
 *                 description: The message we write.
 *             example:
 *               name: John Doe
 *               time: 2025-01-13 13:50:33
 *               message: test test test 123
 *     responses:
 *       201:
 *         description: User and message created successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: John Doe
 *               time: 2025-01-13 13:50:33
 *               message: test test test 123
 *       400:
 *         description: Bad request. Ensure all required fields are provided.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request. Missing required fields.
 */

router.post('/', async (request, response) => {
    try {
        const new_user_message = request.body
        const result = await dal.new_message(new_user_message)
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
/**
 * @swagger
 * /api/chat/{id}:
 *   delete:
 *     summary: Delete an user with message by ID
 *     description: Delete the user with message record with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user with message to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User and message deleted successfully.
 *       404:
 *         description: User and message not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: cannot find user and message with id {id}
 */
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