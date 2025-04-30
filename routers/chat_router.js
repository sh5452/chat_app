const express=require('express')
const router=express.Router()
const dal=require('../dal')
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
        const chats = await dal.get_all();
        response.json(chats);
    } catch (e) {
        logger?.error?.(`Error during GET: ${JSON.stringify(e)}`);
        response.status(500).json({ error: 'Server error' });
    }
});


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
        const { name, time, message } = request.body;

        if (!name || !time || !message) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        const newMessageForDb = {
            NAME: name,
            TIME: time,
            MESSAGE: message
        };

        const result = await dal.new_message(newMessageForDb);
        response.status(201).json(result);
    } catch (e) {
        logger?.error?.(`Error during POST: ${JSON.stringify(e)}`);
        response.status(400).json({ error: e.message || 'Server error' });
    }
});
// PUT
router.put('/:id', async (request, response) => {
    try {
        const user_id = parseInt(request.params.id)
        const user = await dal.get_by_id(user_id)
        if (user) {
            // user exists ==> perform update
            const updated_user_req = request.body
            const result = await dal.update_message(user_id, updated_user_req)
            response.status(200).json(updated_user_req)
        }
        else {
            // user does NOT exist ==> perform insert
            const new_userName = request.body
            const result = await dal.update_message(new_userName)
            response.status(201).json(result)
        }
    }
    catch (e) {
        logger.error(`Error during put ${JSON.stringify(e)}`)
        response.status(400).json({ 'Error': e })
    }
})
// PATCH
router.patch('/:id', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const existing = await dal.get_by_id(messageId);

        if (!existing) {
            return res.status(404).json({ error: `Message with id ${messageId} not found` });
        }

        const updated = await dal.update_message(messageId, req.body);
        res.status(200).json(updated);
    } catch (e) {
        logger.error(`Error during PATCH: ${e.message}`);
        res.status(400).json({ error: e.message });
    }
});

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
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        const deleted = await dal.delete_message(id);
        console.log('deleted:', deleted);
        console.log('מנסה למחוק הודעה עם ID:', id);

        if (!deleted) {
            
            return res.status(404).json({ error: 'הודעה לא נמצאה' });
        }

        res.status(200).json({ message: 'ההודעה נמחקה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בשרת' });
    }
});
module.exports = router