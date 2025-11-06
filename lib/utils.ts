
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateSectionScore(answers: number[]): { score: number; percentage: number } {
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  const maxScore = answers.length * 5; // Échelle de 1 à 5
  const percentage = (score / maxScore) * 100;
  return { score, percentage };
}

export function generateNarrativeReport(results: any): string {
  let report = "# Rapport d'Évaluation des Compétences Managériales\n\n";
  
  report += "## Vue d'ensemble\n\n";
  report += `Score global : ${results.percentageScore.toFixed(1)}%\n\n`;
  
  report += "## Analyse par dimension\n\n";
  
  const sections = [
    { id: 1, name: "Leadership et Vision", score: results.section1Score },
    { id: 2, name: "Communication et Relations Interpersonnelles", score: results.section2Score },
    { id: 3, name: "Gestion des Performances et Développement des Talents", score: results.section3Score },
    { id: 4, name: "Gestion du Changement et Innovation", score: results.section4Score },
    { id: 5, name: "Prise de Décision et Résolution de Problème", score: results.section5Score },
    { id: 6, name: "Gestion du Temps et des Priorités", score: results.section6Score },
    { id: 7, name: "Compétences Techniques et Opérationnelles", score: results.section7Score },
    { id: 8, name: "Engagement et Esprit d'Équipe", score: results.section8Score },
    { id: 9, name: "Intelligence Émotionnelle", score: results.section9Score },
  ];
  
  sections.forEach(section => {
    const percentage = (section.score / 45) * 100; // 9 questions * 5 points max
    report += `### ${section.name}\n`;
    report += `Score : ${percentage.toFixed(1)}%\n`;
    
    if (percentage >= 80) {
      report += "Point fort : Cette dimension est maîtrisée de façon excellente.\n\n";
    } else if (percentage >= 60) {
      report += "Compétence solide : Cette dimension est bien développée avec quelques opportunités d'amélioration.\n\n";
    } else if (percentage >= 40) {
      report += "Axe de développement : Cette dimension nécessite une attention particulière pour progresser.\n\n";
    } else {
      report += "Priorité de développement : Cette dimension nécessite un travail approfondi.\n\n";
    }
  });
  
  report += "## Recommandations\n\n";
  
  // Identifier les 3 meilleures et les 3 plus faibles dimensions
  const sortedSections = [...sections].sort((a, b) => b.score - a.score);
  
  report += "### Points forts à capitaliser :\n";
  sortedSections.slice(0, 3).forEach((section, index) => {
    report += `${index + 1}. ${section.name}\n`;
  });
  
  report += "\n### Axes de développement prioritaires :\n";
  sortedSections.slice(-3).reverse().forEach((section, index) => {
    report += `${index + 1}. ${section.name}\n`;
  });
  
  return report;
}
