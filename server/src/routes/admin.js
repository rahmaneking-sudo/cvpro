import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const ADMIN_EMAIL = 'rahmaneking@gmail.com';
// Hardcoded fallback if env not set
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'RahmanAdmin2026';

// Middleware de vérification Admin
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cvpro_super_secret_key_2024');

    if (decoded.role !== 'superadmin' || decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Accès refusé. Réservé à l\'administrateur.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { role: 'superadmin', email: ADMIN_EMAIL },
        process.env.JWT_SECRET || 'cvpro_super_secret_key_2024',
        { expiresIn: '7d' }
      );
      return res.json({ success: true, token });
    }

    return res.status(401).json({ error: 'Identifiants administrateur incorrects' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur interne' });
  }
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // 1. Nombre d'utilisateurs
    const usersCount = await prisma.user.count();

    // 2. Nombre de visites
    const analytics = await prisma.analytics.findUnique({ where: { id: 'global' } });
    const visitsCount = analytics?.views || 0;

    // 3. Compteurs additionnels
    const cvsCount = await prisma.cV.count();
    const portfoliosCount = await prisma.portfolio.count();

    // 4. Revenus et achats (Balance)
    const purchases = await prisma.purchase.findMany({
      where: { status: 'completed' }
    });
    
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

    // 5. Derniers utilisateurs (pour info)
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true }
    });

    res.json({
      usersCount,
      visitsCount,
      cvsCount,
      portfoliosCount,
      totalRevenue,
      purchasesCount: purchases.length,
      recentUsers
    });
  } catch (error) {
    console.error('Erreur Admin Stats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// POST /api/admin/visit - Ouvert à tous pour incrémenter les visites
router.post('/visit', async (req, res) => {
  try {
    // Upsert the global analytics record
    await prisma.analytics.upsert({
      where: { id: 'global' },
      update: { views: { increment: 1 } },
      create: { id: 'global', views: 1 }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur Analytics Visit:', error);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

export default router;
