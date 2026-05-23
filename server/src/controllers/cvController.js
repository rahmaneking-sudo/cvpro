import prisma from '../utils/prisma.js';
import templates from '../data/templates.js';

// GET /api/cv/templates
export async function getTemplates(req, res) {
  try {
    res.json({ templates });
  } catch (err) {
    console.error('Get templates error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/cv
export async function createCV(req, res) {
  try {
    const { templateId, title, data, experiences } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: 'Template requis' });
    }

    const cv = await prisma.cV.create({
      data: {
        userId: req.userId,
        templateId,
        title: title || 'Mon CV',
        data: data || {},
      },
      include: { experiences: true },
    });

    // Create experiences if provided
    if (experiences && experiences.length > 0) {
      for (const exp of experiences) {
        await prisma.experience.create({
          data: {
            cvId: cv.id,
            company: exp.company,
            position: exp.position,
            description: exp.description || '',
            startDate: exp.startDate,
            endDate: exp.endDate || null,
            logoUrl: exp.logoUrl || null,
            order: exp.order || 0,
          },
        });
      }
    }

    const fullCV = await prisma.cV.findUnique({
      where: { id: cv.id },
      include: { experiences: { orderBy: { order: 'asc' } } },
    });

    res.status(201).json({ cv: fullCV });
  } catch (err) {
    console.error('Create CV error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// PUT /api/cv/:id
export async function updateCV(req, res) {
  try {
    const { id } = req.params;
    const { templateId, title, data, experiences, isPublic } = req.body;

    // Verify ownership
    const existing = await prisma.cV.findFirst({
      where: { id, userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    // Update CV data
    const cv = await prisma.cV.update({
      where: { id },
      data: {
        ...(templateId && { templateId }),
        ...(title !== undefined && { title }),
        ...(data && { data }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    // Update experiences if provided
    if (experiences) {
      // Delete old experiences
      await prisma.experience.deleteMany({ where: { cvId: id } });

      // Create new ones
      for (const exp of experiences) {
        await prisma.experience.create({
          data: {
            cvId: id,
            company: exp.company,
            position: exp.position,
            description: exp.description || '',
            startDate: exp.startDate,
            endDate: exp.endDate || null,
            logoUrl: exp.logoUrl || null,
            order: exp.order || 0,
          },
        });
      }
    }

    const fullCV = await prisma.cV.findUnique({
      where: { id },
      include: { experiences: { orderBy: { order: 'asc' } } },
    });

    res.json({ cv: fullCV });
  } catch (err) {
    console.error('Update CV error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/cv/:id
export async function getCV(req, res) {
  try {
    const cv = await prisma.cV.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { experiences: { orderBy: { order: 'asc' } } },
    });
    if (!cv) return res.status(404).json({ error: 'CV non trouvé' });
    res.json({ cv });
  } catch (err) {
    console.error('Get CV error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// GET /api/cv/user
export async function getUserCVs(req, res) {
  try {
    const cvs = await prisma.cV.findMany({
      where: { userId: req.userId },
      include: { experiences: { orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ cvs });
  } catch (err) {
    console.error('Get user CVs error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// DELETE /api/cv/:id
export async function deleteCV(req, res) {
  try {
    const cv = await prisma.cV.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!cv) return res.status(404).json({ error: 'CV non trouvé' });

    await prisma.cV.delete({ where: { id: cv.id } });
    res.json({ message: 'CV supprimé' });
  } catch (err) {
    console.error('Delete CV error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/cv/:id/enhance — AI section enhancement
export async function enhanceSection(req, res) {
  try {
    const { section, content, language } = req.body;

    if (!section || !content) {
      return res.status(400).json({ error: 'Section et contenu requis' });
    }

    // Check if Gemini key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        enhanced: `[IA] ${content}`,
        message: 'Mode démo — configurez GEMINI_API_KEY pour l\'IA réelle',
      });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `Tu es un expert en recrutement et rédaction de CV avec 20 ans d'expérience.
Tu dois améliorer la section "${section}" d'un CV.

RÈGLES STRICTES :
- Réécris de manière professionnelle, percutante et lisible
- Utilise des verbes d'action forts (Dirigé, Optimisé, Déployé, Conçu, etc.)
- Améliore le vocabulaire et la structure
- Ne JAMAIS inventer d'informations
- Ne JAMAIS ajouter de données qui n'existent pas dans le texte original
- Corrige les fautes d'orthographe et de grammaire
- Adapte le ton au secteur détecté (corporate, tech, créatif, etc.)
- Réponds dans la langue détectée : ${language || 'français'}
- Sois concis et impactant
- Retourne UNIQUEMENT le texte amélioré, sans commentaire ni explication`;

    const result = await model.generateContent([
      systemPrompt,
      { text: `Améliore cette section "${section}" :\n\n${content}` }
    ]);

    const enhanced = result.response.text().trim();

    res.json({ enhanced });
  } catch (err) {
    console.error('Enhance section error:', err);
    res.status(500).json({ error: 'Erreur lors de l\'amélioration IA' });
  }
}

// GET /api/cv/purchase/:templateId
export async function checkPurchase(req, res) {
  try {
    const { templateId } = req.params;
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: req.userId,
        productId: templateId,
        status: 'completed'
      }
    });

    res.json({ purchased: !!purchase });
  } catch (err) {
    console.error('Check purchase error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// POST /api/cv/purchase/simulate
export async function simulatePurchase(req, res) {
  try {
    const { templateId } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: 'Template requis' });
    }

    // Check if already purchased
    const existing = await prisma.purchase.findFirst({
      where: {
        userId: req.userId,
        productId: templateId,
        status: 'completed'
      }
    });

    if (existing) {
      return res.json({ success: true, message: 'Déjà acheté' });
    }

    // Create a completed purchase
    await prisma.purchase.create({
      data: {
        userId: req.userId,
        product: 'cv_template',
        productId: templateId,
        provider: 'simulation',
        currency: 'XOF',
        amount: 1500,
        status: 'completed'
      }
    });

    res.json({ success: true, message: 'Achat simulé avec succès' });
  } catch (err) {
    console.error('Simulate purchase error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
