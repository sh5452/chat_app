const jsonServer = require("json-server");
const express = require('express');
const cors = require('cors');
const chat_routerr=require('./routers/chat_router')
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const app = express();
app.use('/api/users',chat_routerr)
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

// התחלת השרת
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
