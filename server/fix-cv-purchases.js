import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCVPurchases() {
  console.log("Recherche de tous les CVs...");
  const cvs = await prisma.cV.findMany();
  
  let fixedCount = 0;
  for (const cv of cvs) {
    if (cv.templateId) {
      // Check if purchase exists
      const existing = await prisma.purchase.findFirst({
        where: {
          userId: cv.userId,
          productId: cv.templateId,
          status: 'completed'
        }
      });
      
      if (!existing) {
        console.log(`Ajout d'un achat pour le CV de l'utilisateur ${cv.userId} (Template: ${cv.templateId})`);
        await prisma.purchase.create({
          data: {
            userId: cv.userId,
            product: 'cv_template',
            productId: cv.templateId,
            provider: 'system_fix',
            currency: 'XOF',
            amount: 1500,
            status: 'completed'
          }
        });
        fixedCount++;
      }
    }
  }
  
  console.log(`${fixedCount} achats de CV ont été restaurés avec succès.`);
  await prisma.$disconnect();
}

fixCVPurchases().catch(e => {
  console.error(e);
  prisma.$disconnect();
});
