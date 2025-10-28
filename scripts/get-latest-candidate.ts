
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getLatestCandidate() {
  try {
    const candidate = await prisma.candidate.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!candidate) {
      console.log('❌ Aucun candidat trouvé dans la base de données');
      return;
    }

    console.log('\n📋 DERNIER CANDIDAT CRÉÉ:');
    console.log('═══════════════════════════════════════');
    console.log(`ID: ${candidate.id}`);
    console.log(`Nom: ${candidate.firstName} ${candidate.lastName}`);
    console.log(`Email: ${candidate.email}`);
    console.log(`Entreprise: ${candidate.company || 'N/A'}`);
    console.log(`Créé le: ${candidate.createdAt.toLocaleString('fr-FR')}`);
    console.log('═══════════════════════════════════════\n');
    console.log(`💡 Pour compléter le test automatiquement, exécutez:`);
    console.log(`   yarn fast-forward ${candidate.id}\n`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getLatestCandidate();
