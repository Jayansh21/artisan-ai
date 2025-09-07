import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import marketRoutes from './routes/market';
import contactRoutes from './routes/contacts';
import automationRoutes from './routes/automation';
import storytellingRoutes from './routes/storytelling';
import { handleUploadErrors } from './middleware/fileUpload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow file uploads
  crossOriginEmbedderPolicy: false // Disable for Google Cloud APIs
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(morgan('combined'));

// Increase payload limits for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/market', marketRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/storytelling', storytellingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      speechToText: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'configured' : 'not configured',
      translation: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'configured' : 'not configured'
    }
  });
});

// File upload error handling middleware
app.use(handleUploadErrors);

// Global error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false,
      message: 'Validation Error', 
      details: err.message 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid ID format', 
      details: err.message 
    });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({ 
      success: false,
      message: 'Duplicate entry', 
      details: 'Resource already exists' 
    });
  }

  // Default error response
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ArtisanAI Backend running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🎤 Storytelling API available at http://localhost:${PORT}/api/storytelling`);
  
  // Log configuration status
  if (process.env.GOOGLE_CLOUD_PROJECT_ID) {
    console.log(`☁️ Google Cloud services configured for project: ${process.env.GOOGLE_CLOUD_PROJECT_ID}`);
  } else {
    console.log(`⚠️ Google Cloud services not configured. Set GOOGLE_CLOUD_PROJECT_ID to enable speech-to-text and translation features.`);
  }
});