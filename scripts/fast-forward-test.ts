
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fastForwardTest(candidateId: string) {
  console.log(`🚀 Démarrage du test rapide pour le candidat ${candidateId}...`);

  try {
    // Vérifier que le candidat existe
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      console.error('❌ Candidat introuvable');
      return;
    }

    console.log(`✅ Candidat trouvé: ${candidate.firstName} ${candidate.lastName}`);

    // Charger les données du test
    const fs = require('fs');
    const path = require('path');
    const testDataPath = path.join(process.cwd(), 'public', 'test_data.json');
    const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

    // Calculer le nombre total de questions
    const totalQuestions = testData.sections.reduce(
      (acc: number, section: any) => acc + section.questions.length,
      0
    );

    console.log(`📝 Nombre total de questions: ${totalQuestions}`);

    // Générer des réponses aléatoires (valeurs de 1 à 6 pour l'échelle de Likert)
    const answers: { [key: string]: number } = {};
    
    testData.sections.forEach((section: any, sectionIndex: number) => {
      section.questions.forEach((question: string, questionIndex: number) => {
        // Générer un ID unique pour chaque question (sectionId-questionIndex)
        const questionId = `${section.id}-${questionIndex}`;
        // Générer une réponse aléatoire entre 1 et 6
        answers[questionId] = Math.floor(Math.random() * 6) + 1;
      });
    });

    console.log(`✅ ${Object.keys(answers).length} réponses générées`);

    // Mettre à jour ou créer le progrès du test
    await prisma.testProgress.upsert({
      where: { candidateId },
      update: {
        currentSection: testData.sections.length,
        currentQuestion: totalQuestions,
        answers: answers,
        completed: true,
        completedAt: new Date(),
      },
      create: {
        candidateId,
        currentSection: testData.sections.length,
        currentQuestion: totalQuestions,
        answers: answers,
        completed: true,
        completedAt: new Date(),
      },
    });

    console.log('✅ Progrès du test enregistré');

    // Calculer les scores par section
    const sectionScores: { [key: number]: number } = {};
    let totalScore = 0;
    let maxTotalScore = 0;

    testData.sections.forEach((section: any) => {
      let sectionTotal = 0;
      let sectionMax = 0;

      section.questions.forEach((question: string, questionIndex: number) => {
        const questionId = `${section.id}-${questionIndex}`;
        const response = answers[questionId];
        sectionTotal += response;
        sectionMax += 6; // Score maximum par question
      });

      const sectionPercentage = Math.round((sectionTotal / sectionMax) * 100);
      sectionScores[section.id] = sectionPercentage;
      
      totalScore += sectionTotal;
      maxTotalScore += sectionMax;
    });

    const percentageScore = Math.round((totalScore / maxTotalScore) * 100);

    console.log('✅ Scores calculés:', sectionScores);
    console.log(`📊 Score total: ${percentageScore}%`);

    // Préparer les données radar pour la visualisation
    const radarData = testData.sections.map((section: any) => ({
      competence: section.title,
      score: sectionScores[section.id],
    }));

    // Enregistrer les résultats
    await prisma.testResult.upsert({
      where: { candidateId },
      update: {
        section1Score: sectionScores[1],
        section2Score: sectionScores[2],
        section3Score: sectionScores[3],
        section4Score: sectionScores[4],
        section5Score: sectionScores[5],
        section6Score: sectionScores[6],
        section7Score: sectionScores[7],
        section8Score: sectionScores[8],
        section9Score: sectionScores[9],
        totalScore: totalScore,
        percentageScore: percentageScore,
        radarData: radarData,
      },
      create: {
        candidateId,
        section1Score: sectionScores[1],
        section2Score: sectionScores[2],
        section3Score: sectionScores[3],
        section4Score: sectionScores[4],
        section5Score: sectionScores[5],
        section6Score: sectionScores[6],
        section7Score: sectionScores[7],
        section8Score: sectionScores[8],
        section9Score: sectionScores[9],
        totalScore: totalScore,
        percentageScore: percentageScore,
        radarData: radarData,
      },
    });

    console.log('✅ Résultats enregistrés');

    // Afficher un résumé
    console.log('\n📊 RÉSUMÉ DES RÉSULTATS:');
    console.log('═══════════════════════════════════════════════════════════════');
    testData.sections.forEach((section: any) => {
      console.log(`${section.title}: ${sectionScores[section.id]}%`);
    });
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📈 Score total: ${percentageScore}%`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n🎉 Test complété pour ${candidate.firstName} ${candidate.lastName}!`);
    console.log(`🔗 Voir les résultats: http://localhost:3456/results/${candidateId}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Récupérer l'ID du candidat depuis les arguments de ligne de commande
const candidateId = process.argv[2];

if (!candidateId) {
  console.error('❌ Veuillez fournir un ID de candidat');
  console.log('Usage: yarn fast-forward <candidateId>');
  process.exit(1);
}

fastForwardTest(candidateId);
