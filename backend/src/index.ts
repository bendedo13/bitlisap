import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { generalLimiter } from './middleware/rateLimit';
import { handleUploadError } from './middleware/upload';
import { setupSocketHandlers } from './socket/chat';

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

// Error handling
app.use(handleUploadError);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Sunucu hatasi',
      ...(config.NODE_ENV === 'development' && {
        message: err.message,
      }),
    });
  }
);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadi' });
});

// Start
const PORT = config.API_PORT;
httpServer.listen(PORT, config.API_HOST, () => {
  console.log(
    `Bitlis Sehrim API calisiyor: http://localhost:${PORT}`
  );
  console.log(`Ortam: ${config.NODE_ENV}`);
});

export { app, httpServer, io };
