import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import cvRoutes from './routes/cv.js';
import aiRoutes from './routes/ai.js';
import portfolioRoutes from './routes/portfolio.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';

// Load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ==========================================
// SÉCURITÉ
// ==========================================

// Helmet — Headers de sécurité HTTP
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Permet de charger les images cross-origin
  contentSecurityPolicy: isProd ? undefined : false,
}));

// Masquer la techno serveur
app.disable('x-powered-by');

// CORS strict
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting — anti brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 tentatives par fenêtre
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsing avec limite
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files (Uploads)
app.use('/uploads', express.static(join(__dirname, '../public/uploads')));

// ==========================================
// ROUTES
// ==========================================

// Health check (pas de rate limit)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'CV Pro API',
    version: '1.0.0',
    // Ne PAS exposer d'infos sensibles en prod
    ...(isProd ? {} : { timestamp: new Date().toISOString() }),
  });
});

// Auth routes avec rate limiting strict
app.use('/api/auth', authLimiter, authRoutes);

// CV routes avec rate limiting standard
app.use('/api/cv', apiLimiter, cvRoutes);

// AI routes avec rate limiting standard
app.use('/api/ai', apiLimiter, aiRoutes);

// Portfolio routes
app.use('/api/portfolios', apiLimiter, portfolioRoutes);

// Upload routes (Files, Images)
app.use('/api/upload', apiLimiter, uploadRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Future routes
// app.use('/api/enhance', apiLimiter, enhanceRoutes);
// app.use('/api/payment', apiLimiter, paymentRoutes);

// ==========================================
// GESTION D'ERREURS
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Global error handler — JAMAIS exposer les stack traces en prod
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: isProd ? 'Erreur interne du serveur' : err.message,
    // Ne JAMAIS exposer la stack en production
  });
});

app.listen(PORT, () => {
  console.log(`\n  🎬 CV Pro API running on http://localhost:${PORT}`);
  console.log(`  🔒 Mode: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}\n`);
});

export default app;
