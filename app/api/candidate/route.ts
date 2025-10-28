import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, company, department, position } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, prénom et nom sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si le candidat existe déjà
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email },
    });

    if (existingCandidate) {
      return NextResponse.json(existingCandidate);
    }

    // Créer un nouveau candidat
    const newCandidate = await prisma.candidate.create({
      data: {
        email,
        firstName,
        lastName,
        company,
        department,
        position,
        hasPaid: false,
      },
    });

    return NextResponse.json(newCandidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du profil' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('id');

    if (!candidateId) {
      return NextResponse.json(
        { error: 'ID du candidat requis' },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidat non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du candidat' },
      { status: 500 }
    );
  }
}