import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function resetAll() {
  console.log('Suppression de TOUS les achats dans la base de données...');
  const deleted = await prisma.purchase.deleteMany();
  console.log(deleted.count + ' achats supprimés.');
  await prisma.$disconnect();
}
resetAll().catch(console.error);
