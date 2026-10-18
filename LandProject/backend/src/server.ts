import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { router as apiRouter } from './routes/api.js';
import { db } from './db/database.js';
import { generateSeedData } from './db/seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    platform: 'LandSure BD',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRouter);

// Serve Static Frontend (Vite build)
const frontendDistPath = process.env.FRONTEND_DIST_PATH || path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server & auto-seed if store is empty
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🇧🇩 LandSure BD API Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Mock OTP: ${process.env.MOCK_OTP_ENABLED !== 'false' ? 'ENABLED (Default: 123456)' : 'DISABLED'}`);
  console.log(`=======================================================`);

  if (db.getUsers().length === 0) {
    console.log('Database empty, populating initial demo seed data...');
    const seedData = await generateSeedData();
    db.setStore(seedData);
    console.log('✅ Auto-seed completed successfully.');
  }
});
