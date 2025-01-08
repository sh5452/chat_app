const logger = require('./logger/my_logger')

logger.info('==== System start =======')

const dal = require('./dal')
const path = require('path')
const jsonServer = require("json-server");
const express = require('express');
const cors = require('cors');
// const chat_routers=require('./routers/chat_router')
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const app = express();
// app.use('/api/chat',chat_routers)
app.use(express.static(path.join('.', '/static/'))) 
const port = process.env.PORT || 3001;

// הגדרת CORS
app.use(cors({
  origin: '*', // מאפשר גישה מכל מקור
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // התרת שיטות HTTP מסוימות
  allowedHeaders: ['Content-Type', 'Authorization'] // התרת כותרות מסוימות
}));

// הפעלת middlewares
server.use(middlewares);

// חיבור ה-router
server.use(router);
// GET 
app.get('/api/users', async (request, response) => {
  const users = await dal.get_all()
  response.json(users)
})
// GET by ID
app.get('/api/user/:id', async (request, response) => {
  const user_id = parseInt(request.params.id)
  const user = await dal.get_by_id(user_id)
  if (user) {
      response.json(user)
  }
  else {
      response.status(404).json({ "error": `cannot find user with id ${user_id}` })
  }
})
// POST
app.post('/api/user', async (request, response) => {
  const new_user = request.body
  const result = await dal.new_user(new_user)
  response.status(201).json(result)
})
// PUT
app.put('/api/user/:id', async (request, response) => {
  const user_id = parseInt(request.params.id)
  const user = await dal.get_by_id(user_id)
  if (user) {
      // user exists ==> perform update
      const updated_user_req = request.body
      const result = await dal.update_user(user_id, updated_user_req)
      response.json(updated_user_req)
  }
  else {
      // user does NOT exist ==> perform insert
      const new_userName = request.body
      const result = await dal.new_user(new_userName)
      response.status(201).json(result)
  }
})
// PATCH
app.patch('/api/user/:id', async (request, response) => {
  const updated_user_req = request.body
  const user_id = parseInt(request.params.id)
  const user = await dal.get_by_id(user_id)
  // override only existing fields in the user from the db
  const result = await dal.update_user(user_id, { ...user, ...updated_user_req })
  response.json({ result })

})

// DELETE
app.delete('/api/user/:id', async (request, response) => {
  const user_id = parseInt(request.params.id)
  const result = await dal.delete_user(user_id)
  response.status(204).json({ result })

})


// התחלת השרת
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  logger.info('==== Server started =======')
  console.log('Express server is running ....');
});

logger.info('==== System stop =======')