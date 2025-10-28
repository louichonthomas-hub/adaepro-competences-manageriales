
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get('candidateId');

    if (!candidateId) {
      return NextResponse.json({ error: 'Missing candidateId' }, { status: 400 });
    }

    const progress = await prisma.testProgress.findUnique({
      where: { candidateId },
    });

    if (!progress) {
      // Créer un nouveau progrès si aucun n'existe
      const newProgress = await prisma.testProgress.create({
        data: {
          candidateId,
          currentSection: 1,
          currentQuestion: 0,
          answers: {},
        },
      });
      return NextResponse.json(newProgress);
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, currentQuestion, answers, completed } = body;

    if (!candidateId) {
      return NextResponse.json({ error: 'Missing candidateId' }, { status: 400 });
    }

    const progress = await prisma.testProgress.upsert({
      where: { candidateId },
      update: {
        currentQuestion,
        answers,
        completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        candidateId,
        currentQuestion: currentQuestion || 0,
        answers: answers || {},
        completed: completed || false,
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Save progress error:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
