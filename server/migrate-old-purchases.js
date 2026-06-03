import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function migrate() {
  console.log('Démarrage de la migration des anciens achats...');
  
  try {
    // 1. Récupérer tous les CVs existants
    const cvs = await prisma.cV.findMany({
      select: { userId: true, templateId: true }
    });

    // 2. Récupérer tous les Portfolios existants
    const portfolios = await prisma.portfolio.findMany({
      select: { userId: true, templateId: true, type: true }
    });

    let migratedCount = 0;

    // Process CVs
    for (const cv of cvs) {
      if (!cv.templateId || !cv.userId) continue;
      
      const existing = await prisma.purchase.findFirst({
        where: {
          userId: cv.userId,
          productId: cv.templateId,
          status: 'completed'
        }
      });

      if (!existing) {
        await prisma.purchase.create({
          data: {
            userId: cv.userId,
            productId: cv.templateId,
            product: 'cv_template',
            provider: 'migration_system',
            currency: 'XOF',
            amount: 0,
            status: 'completed',
            metadata: { note: 'Migration ancien utilisateur gratuit' }
          }
        });
        migratedCount++;
      }
    }

    // Process Portfolios
    for (const pf of portfolios) {
      if (!pf.templateId || !pf.userId) continue;
      
      const existing = await prisma.purchase.findFirst({
        where: {
          userId: pf.userId,
          productId: pf.templateId,
          status: 'completed'
        }
      });

      if (!existing) {
        await prisma.purchase.create({
          data: {
            userId: pf.userId,
            productId: pf.templateId,
            product: pf.type === 'premium' ? 'portfolio_premium' : 'portfolio_simple',
            provider: 'migration_system',
            currency: 'XOF',
            amount: 0,
            status: 'completed',
            metadata: { note: 'Migration ancien utilisateur gratuit' }
          }
        });
        migratedCount++;
      }
    }

    console.log(`Migration terminée avec succès ! ${migratedCount} accès retro-accordés.`);
  } catch (err) {
    console.error('Erreur lors de la migration:', err);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
