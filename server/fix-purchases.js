import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPurchases() {
  console.log("Recherche de tous les portfolios...");
  const portfolios = await prisma.portfolio.findMany();
  
  let fixedCount = 0;
  for (const pf of portfolios) {
    if (pf.templateId) {
      // Check if purchase exists
      const existing = await prisma.purchase.findFirst({
        where: {
          userId: pf.userId,
          productId: pf.templateId,
          status: 'completed'
        }
      });
      
      if (!existing) {
        console.log(`Ajout d'un achat pour le portfolio de l'utilisateur ${pf.userId} (Template: ${pf.templateId})`);
        await prisma.purchase.create({
          data: {
            userId: pf.userId,
            product: 'portfolio_premium',
            productId: pf.templateId,
            provider: 'system_fix',
            currency: 'XOF',
            amount: 5000,
            status: 'completed'
          }
        });
        fixedCount++;
      }
    }
  }
  
  console.log(`${fixedCount} achats de portfolios ont été restaurés avec succès.`);
  await prisma.$disconnect();
}

fixPurchases().catch(e => {
  console.error(e);
  prisma.$disconnect();
});
