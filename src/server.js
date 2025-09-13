import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routes/users.js';
import taskRouter from './routes/tasks.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import { StatusCodes } from 'http-status-codes';
import authenticate from './middlewares/authenticate.js';
import { isProd } from './helper.js';
import requestId from './middlewares/requestId.js';
import logger from './middlewares/logger.js';
import { testDatabaseConnection } from './db/connection.js';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestId);
app.use(logger);

// to get the swagger api docs
const swaggerDocument = YAML.load('./swagger.yaml');

// Routes
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/users", userRouter);
app.use("/tasks", authenticate, taskRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});


// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ 
    error: 'Route not found',
    type: 'NotFoundError',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
});

// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

// Start server only after successful database connection
const startServer = async () => {
  try {
    // Test database connection first
    await testDatabaseConnection();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${isProd() ? 'Production' : 'Development'}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
