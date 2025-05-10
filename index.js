const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const logger = require('./logger/my_logger');
const chat_routers = require('./routers/chat_router');
const { get_all } = require('./dal'); // הוסיפי גם את saveMessage אם יש

// התחלה
logger.info('==== System start =======');

const app = express();
// חיבור לנתיב של הצ'אט (API אמיתי בלבד)
app.use('/api/chat', chat_routers);
app.use(express.static('public'));
const port = process.env.PORT || 3001;

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// תמיכה בבקשות JSON
app.use(bodyParser.json());




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

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API route not found' });
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});


// הפעלת שרת Express
app.listen(port, () => {
  logger.info('==== Server started =======');
  console.log(`Express server is running on port ${port}`);
});