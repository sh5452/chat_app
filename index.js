const jsonServer = require("json-server");
const express = require('express');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const app = express();
const port = process.env.PORT || 3001;

// הגדרת CORS
app.use(cors());

// הפעלת middlewares
server.use(middlewares);

// חיבור ה-router
server.use(router);

// התחלת השרת
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
