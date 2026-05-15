import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/portfolios
export async function createPortfolio(req, res) {
  try {
    const { templateId, type, title, data } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ error: 'templateId est requis' });
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: req.userId,
        templateId,
        type: type || 'simple',
        title: title || 'Nouveau Portfolio',
        data: data || {},
      },
    });

    res.status(201).json({ portfolio });
  } catch (err) {
    console.error('Create Portfolio error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// PUT /api/portfolios/:id
export async function updatePortfolio(req, res) {
  try {
    const { templateId, type, title, data } = req.body;
    
    const portfolio = await prisma.portfolio.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio non trouvé' });
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        templateId: templateId || portfolio.templateId,
        type: type || portfolio.type,
        title: title || portfolio.title,
        data: data !== undefined ? data : portfolio.data,
      },
    });

    res.json({ portfolio: updatedPortfolio });
  } catch (err) {
    console.error('Update Portfolio error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/portfolios/:id
export async function getPortfolio(req, res) {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio non trouvé' });
    res.json({ portfolio });
  } catch (err) {
    console.error('Get Portfolio error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/portfolios/public/:id
export async function getPublicPortfolio(req, res) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: req.params.id },
    });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio public non trouvé' });
    res.json({ portfolio });
  } catch (err) {
    console.error('Get Public Portfolio error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/portfolios/user
export async function getUserPortfolios(req, res) {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ portfolios });
  } catch (err) {
    console.error('Get user portfolios error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// DELETE /api/portfolios/:id
export async function deletePortfolio(req, res) {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio non trouvé' });

    await prisma.portfolio.delete({ where: { id: portfolio.id } });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Portfolio error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
