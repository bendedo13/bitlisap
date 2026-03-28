import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { generalLimiter } from './middleware/rateLimit';
import { handleUploadError } from './middleware/upload';
import { setupSocketHandlers } from './socket/chat';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';
import { logger } from './utils/logger';

// Routes
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import newsRoutes from './routes/news.routes';
import listingsRoutes from './routes/listings.routes';
import businessesRoutes from './routes/businesses.routes';
import eventsRoutes from './routes/events.routes';
import messagesRoutes from './routes/messages.routes';
import weatherRoutes from './routes/weather.routes';
import emergencyRoutes from './routes/emergency.routes';
import notificationsRoutes
  from './routes/notifications.routes';
import searchRoutes from './routes/search.routes';
import legalRoutes from './routes/legal.routes';

const app = express();
const httpServer = createServer(app);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST'],
  },
});

setupSocketHandlers(io);

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN.split(','),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Bitlis Sehrim API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/businesses', businessesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/legal', legalRoutes);

app.use(notFoundHandler);
app.use(handleUploadError);
app.use(errorHandler);

// Start
const PORT = config.API_PORT;
httpServer.listen(PORT, config.API_HOST, () => {
  logger.info(
    `Bitlis Sehrim API calisiyor: http://localhost:${PORT}`
  );
  logger.info(`Ortam: ${config.NODE_ENV}`);
});

export { app, httpServer, io };
