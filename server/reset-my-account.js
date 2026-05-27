import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAccount() {
  console.log("Recherche de votre compte...");
  // Trouver l'utilisateur par nom
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'kaiphos', mode: 'insensitive' } },
        { email: { contains: 'kaiphos', mode: 'insensitive' } }
      ]
    }
  });

  if (users.length === 0) {
    console.log("Aucun compte trouvé avec ce nom.");
    return;
  }

  for (const user of users) {
    console.log(`Réinitialisation du compte: ${user.name} (${user.email})`);
    
    // 2. Supprimer tout l'historique de ses achats (pour forcer le paywall)
    const deletedPurchases = await prisma.purchase.deleteMany({
      where: { userId: user.id }
    });

    console.log(`-> Statut Premium retiré. ${deletedPurchases.count} achats supprimés.`);
  }

  console.log("Terminé ! Testez sur votre téléphone, le paiement devrait être exigé.");
  await prisma.$disconnect();
}

resetAccount().catch(e => {
  console.error(e);
  prisma.$disconnect();
});



