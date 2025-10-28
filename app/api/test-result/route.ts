
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateSectionScore, generateNarrativeReport } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get('candidateId');

    if (!candidateId) {
      return NextResponse.json({ error: 'Missing candidateId' }, { status: 400 });
    }

    const result = await prisma.testResult.findUnique({
      where: { candidateId },
      include: { candidate: true },
    });

    if (!result) {
      return NextResponse.json({ error: 'No result found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get result error:', error);
    return NextResponse.json({ error: 'Failed to get result' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, answers } = body;

    if (!candidateId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculer les scores pour chaque section
    const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const sectionScores: any = {};
    let totalScore = 0;

    sections.forEach(sectionId => {
      const sectionAnswers = answers[sectionId] || [];
      const { score } = calculateSectionScore(sectionAnswers);
      sectionScores[`section${sectionId}Score`] = score;
      totalScore += score;
    });

    // Calculer le pourcentage global (81 questions * 5 points max = 405)
    const percentageScore = (totalScore / 405) * 100;

    // Générer les données pour le graphique radar
    const radarData = {
      labels: [
        'Leadership et Vision',
        'Communication',
        'Gestion des Performances',
        'Changement et Innovation',
        'Prise de Décision',
        'Gestion du Temps',
        'Compétences Techniques',
        'Engagement et Équipe',
        'Intelligence Émotionnelle',
      ],
      datasets: [
        {
          label: 'Scores',
          data: sections.map(id => ((sectionScores[`section${id}Score`] / 45) * 100).toFixed(1)),
        },
      ],
    };

    const resultData = {
      ...sectionScores,
      totalScore,
      percentageScore,
      radarData,
    };

    // Générer le rapport narratif
    const narrativeReport = generateNarrativeReport(resultData);

    // Sauvegarder les résultats
    const result = await prisma.testResult.upsert({
      where: { candidateId },
      update: {
        ...sectionScores,
        totalScore,
        percentageScore,
        radarData,
        narrativeReport,
      },
      create: {
        candidateId,
        ...sectionScores,
        totalScore,
        percentageScore,
        radarData,
        narrativeReport,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Save result error:', error);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}
