
import ExcelJS from 'exceljs';

// Générer un fichier Excel avec les données du candidat
export async function generateCandidateExcel(data: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  department?: string;
  position?: string;
  timestamp: string;
}) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Informations Candidat');

  // Titre principal
  worksheet.mergeCells('A1:B1');
  worksheet.getCell('A1').value = 'FORMULAIRE D\'IDENTIFICATION - COMPÉTENCES MANAGÉRIALES';
  worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  worksheet.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0a2b4c' }
  };
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 30;

  // Ligne vide
  worksheet.addRow([]);

  // Section Informations Candidat
  worksheet.mergeCells('A3:B3');
  worksheet.getCell('A3').value = 'INFORMATIONS DU CANDIDAT';
  worksheet.getCell('A3').font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  worksheet.getCell('A3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF60B5FF' }
  };
  worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  // Informations du candidat
  let currentRow = 4;
  
  worksheet.getCell(`A${currentRow}`).value = 'Prénom :';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.firstName;
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = 'Nom :';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.lastName;
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = 'Email :';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.email;
  currentRow++;

  if (data.company) {
    worksheet.getCell(`A${currentRow}`).value = 'Entreprise :';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = data.company;
    currentRow++;
  }

  if (data.department) {
    worksheet.getCell(`A${currentRow}`).value = 'Département :';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = data.department;
    currentRow++;
  }

  if (data.position) {
    worksheet.getCell(`A${currentRow}`).value = 'Fonction :';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = data.position;
    currentRow++;
  }

  worksheet.getCell(`A${currentRow}`).value = 'Date d\'inscription :';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.timestamp;
  currentRow++;

  // Ajuster les largeurs de colonnes
  worksheet.getColumn('A').width = 25;
  worksheet.getColumn('B').width = 40;

  // Ajouter des bordures à toutes les cellules utilisées
  for (let row = 3; row <= currentRow; row++) {
    ['A', 'B'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row}`);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  // Générer le buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
