const express = require('express');
const cors = require('cors');
const path = require('path');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const logger = require('./logger/my_logger');
const chat_routers = require('./routers/chat_router');

// התחלה
logger.info('==== System start =======');

const app = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const port = process.env.PORT || 3001;

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// תמיכה בבקשות JSON
app.use(bodyParser.json());

// חיבור לנתיב של הצ'אט (API אמיתי)
app.use('/api/chat', chat_routers);

// חיבור JSON-Server מדומה תחת /api/db
app.use('/api/db', middlewares, router);

// Swagger - תיעוד API
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat App API",
      version: "1.0.0",
      description: "API for Chat Application",
    },
    servers: [
      {
        url: "https://chat-app-8qzs.onrender.com/",
      },
    ],
  },
  apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// הפעלת שרת Express
app.listen(port, () => {
  logger.info('==== Server started =======');
  console.log(`Express server is running on port ${port}`);
});