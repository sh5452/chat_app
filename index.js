const logger = require('./logger/my_logger')

logger.info('==== System start =======')


const path = require('path')
// const jsonServer = require("json-server");
const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors');
const chat_routers=require('./routers/chat_router')
// const server = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();

const app = express();
app.use('/api/chat',chat_routers)
app.use(express.static(path.join('.', '/static/'))) 
app.use(body_parser.json())
const port = process.env.PORT || 3001;

// הגדרת CORS
app.use(cors({
  origin: '*', // מאפשר גישה מכל מקור
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // התרת שיטות HTTP מסוימות
  allowedHeaders: ['Content-Type', 'Authorization'] // התרת כותרות מסוימות
}));

// הפעלת middlewares
// server.use(middlewares);

// חיבור ה-router
// server.use(router);




// התחלת השרת
app.listen(port, () => {
  logger.info('==== Server started =======')
  console.log(`Express server is running on port ${port}`);
});

logger.info('==== System stop =======')