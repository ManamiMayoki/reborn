import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { seedDemoData } from './utils/seedData.js';
import { mockStore } from './utils/mockStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting (generous for computational workflows)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests from this client, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Mount API routes
app.use('/api/v1', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Reborn - Interactive 3D Computational Drug Discovery API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    endpoints: [
      '/api/v1/projects',
      '/api/v1/targets',
      '/api/v1/ligands',
      '/api/v1/workflows/:projectId',
      '/api/v1/docking',
      '/api/v1/interactions',
      '/api/v1/admet',
      '/api/v1/validation',
      '/api/v1/reports/summary',
    ],
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server startup and seeding
const startServer = async () => {
  console.log('[Reborn] Booting Computational Drug Discovery Server...');
  await connectDB();
  
  // Seed demo data into store immediately so all 8 workflow stages are ready
  try {
    await seedDemoData();
  } catch (err) {
    console.error('[Reborn] Warning during seed initialisation:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`[Reborn Engine] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    console.log(`[Reborn API] Active at http://localhost:${PORT}/api/v1`);
  });

  return server;
};

// Start if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
