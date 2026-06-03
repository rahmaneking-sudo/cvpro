import { Router } from 'express';
import prisma from '../utils/prisma.js';
import jwt from 'jsonwebtoken';

const router = Router();

const ADMIN_EMAIL = 'rahmaneking@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Middleware de vérification Admin
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
        process.env.JWT_SECRET,
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
    const purchaseStats = await prisma.purchase.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true },
      _count: true,
    });
    
    const totalRevenue = purchaseStats._sum.amount || 0;
    const purchasesCount = purchaseStats._count || 0;

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
      purchasesCount,
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
    // Upsert in background (fire-and-forget) to avoid blocking the response
    prisma.analytics.upsert({
      where: { id: 'global' },
      update: { views: { increment: 1 } },
      create: { id: 'global', views: 1 }
    }).catch(err => console.error('Background Analytics Visit error:', err));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur Analytics Visit:', error);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

// ==========================================
// CHAT SUPPORT ADMIN ROUTES
// ==========================================

// GET /api/admin/chats
router.get('/chats', requireAdmin, async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Admin Chats Error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/chats/:sessionId
router.get('/chats/:sessionId', requireAdmin, async (req, res) => {
  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: req.params.sessionId },
      include: {
        user: { select: { name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });
    if (!session) return res.status(404).json({ error: 'Session introuvable' });
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/chats/:sessionId/reply
router.post('/chats/:sessionId/reply', requireAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Message vide' });

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: req.params.sessionId,
        sender: 'admin',
        content: content.trim(),
        isRead: false
      }
    });

    await prisma.chatSession.update({
      where: { id: req.params.sessionId },
      data: { updatedAt: new Date(), status: 'open' }
    });

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/chats/:sessionId/close
router.put('/chats/:sessionId/close', requireAdmin, async (req, res) => {
  try {
    await prisma.chatSession.update({
      where: { id: req.params.sessionId },
      data: { status: 'closed' }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// USER MANAGEMENT ADMIN ROUTES
// ==========================================

// GET /api/admin/users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        isActive: true,
        createdAt: true,
      }
    });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Admin Users Error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/admin/users/:userId/status
router.patch('/users/:userId/status', requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    // Get current user to check if status changed from false to true
    const userBefore = await prisma.user.findUnique({
      where: { id: req.params.userId }
    });

    if (!userBefore) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.userId },
      data: { isActive }
    });

    // If activated, send email
    if (isActive === true && userBefore.isActive === false) {
      try {
        const { sendActivationEmail } = await import('../services/emailService.js');
        await sendActivationEmail(updatedUser.email, updatedUser.name);
      } catch (emailErr) {
        console.error('Activation email error:', emailErr);
        // Continue even if email fails
      }
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update User Status Error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
