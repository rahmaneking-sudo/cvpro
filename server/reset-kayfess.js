import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetKayfess() {
  const user = await prisma.user.findFirst({ 
    where: { email: { contains: 'kayfess', mode: 'insensitive' } } 
  });
  
  if (!user) {
    console.log('Utilisateur non trouvé');
    return;
  }
  
  const cvs = await prisma.cV.deleteMany({ where: { userId: user.id } });
  const portfolios = await prisma.portfolio.deleteMany({ where: { userId: user.id } });
  
  console.log('Donnees effacees pour ' + user.email);
  console.log('CV supprimes : ' + cvs.count);
  console.log('Portfolios supprimes : ' + portfolios.count);
  
  await prisma.$disconnect();
}

resetKayfess().catch(console.error);
