
import { NextRequest, NextResponse } from 'next/server';
import { generateCandidateExcel } from '@/lib/excel-export';
import { getOrCreateFolder, uploadFile } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, department, position } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Prénom, nom et email sont requis' },
        { status: 400 }
      );
    }

    console.log('=== Enregistrement du candidat sur Google Drive ===');
    console.log('Candidat:', firstName, lastName, `(${email})`);
    console.log('Date:', new Date().toISOString());
    console.log('====================================================');

    // Export vers Google Drive
    try {
      // Générer le fichier Excel
      const excelBuffer = await generateCandidateExcel({
        firstName,
        lastName,
        email,
        company,
        department,
        position,
        timestamp: new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

      // Créer ou obtenir le dossier "Candidats Compétences Managériales" dans Google Drive
      const mainFolder = await getOrCreateFolder('Candidats Compétences Managériales');
      
      // Créer ou obtenir le sous-dossier avec le nom du candidat
      const candidateName = `${firstName} ${lastName}`;
      const candidateFolder = await getOrCreateFolder(candidateName, mainFolder.id || undefined);
      
      // Uploader le fichier Excel dans le dossier du candidat
      const fileName = `Inscription_${firstName}_${lastName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      const uploadResult = await uploadFile(
        excelBuffer,
        fileName,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        candidateFolder.id || undefined
      );

      console.log('✅ Fichier Excel exporté vers Google Drive:', uploadResult);

      return NextResponse.json({
        success: true,
        message: 'Les informations ont été enregistrées et exportées vers Google Drive',
        data: {
          driveFile: {
            id: uploadResult.id,
            name: uploadResult.name,
            link: uploadResult.webViewLink
          }
        }
      });

    } catch (driveError) {
      console.error('⚠️ Erreur lors de l\'export vers Google Drive:', driveError);
      
      // Si l'export Google Drive échoue, on retourne une réponse avec un avertissement
      return NextResponse.json({
        success: true,
        message: 'Les informations ont été enregistrées (export Google Drive non disponible)',
        warning: 'Export vers Google Drive non configuré ou échoué'
      });
    }

  } catch (error) {
    console.error('Error saving candidate to Google Drive:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement des informations' },
      { status: 500 }
    );
  }
}
