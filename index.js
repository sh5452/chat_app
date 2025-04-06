const logger = require('./logger/my_logger')

logger.info('==== System start =======')


const path = require('path')
const jsonServer = require("json-server");
const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors');
const chat_routers=require('./routers/chat_router')
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const app = express();

app.use(express.static(path.join('.', '/static/')))
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express') 
app.use(body_parser.json())
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
app.listen(port, () => {
  logger.info('==== Server started =======')
  console.log(`Express server is running on port ${port}`);
});

// const options = {
//   definition: {
//       openapi: "3.0.0",
//       info: {
//           title: "Library API",
//           version: "1.0.0",
//           description: "My REST API employee",
//       },
//       servers: [
//           {
//               url: "https://chat-app-58mc.onrender.com/",
//           },
//       ],
//   },
//   apis: ["./routers/*.js"],
// };

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);



app.use('/api/chat',chat_routers)
logger.info('==== System stop =======')