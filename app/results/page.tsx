
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, TrendingUp, Award } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TestResult {
  id: string;
  candidateId: string;
  section1Score: number;
  section2Score: number;
  section3Score: number;
  section4Score: number;
  section5Score: number;
  section6Score: number;
  section7Score: number;
  section8Score: number;
  section9Score: number;
  totalScore: number;
  percentageScore: number;
  managementStyles: any;
  radarData: any;
  narrativeReport: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
  };
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams?.get('candidateId');

  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!candidateId) {
      router.push('/identification');
      return;
    }

    // Charger les résultats
    fetch(`/api/test-result?candidateId=${candidateId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('No results found');
        }
        return res.json();
      })
      .then(data => {
        setResult(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading results:', err);
        alert('Aucun résultat trouvé. Veuillez d\'abord compléter le test.');
        router.push(`/test?candidateId=${candidateId}`);
      });
  }, [candidateId, router]);

  const handleDownloadPDF = () => {
    // TODO: Implémenter la génération PDF
    alert('La génération PDF sera implémentée dans la prochaine phase');
  };

  if (isLoading || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--navy)' }} />
      </div>
    );
  }

  // Préparer les données pour le graphique radar
  const radarChartData = [
    { dimension: 'Leadership', score: ((result.section1Score / 45) * 100).toFixed(1) },
    { dimension: 'Communication', score: ((result.section2Score / 45) * 100).toFixed(1) },
    { dimension: 'Performances', score: ((result.section3Score / 45) * 100).toFixed(1) },
    { dimension: 'Changement', score: ((result.section4Score / 45) * 100).toFixed(1) },
    { dimension: 'Décision', score: ((result.section5Score / 45) * 100).toFixed(1) },
    { dimension: 'Temps', score: ((result.section6Score / 45) * 100).toFixed(1) },
    { dimension: 'Technique', score: ((result.section7Score / 45) * 100).toFixed(1) },
    { dimension: 'Équipe', score: ((result.section8Score / 45) * 100).toFixed(1) },
    { dimension: 'Intelligence Émot.', score: ((result.section9Score / 45) * 100).toFixed(1) },
  ];

  const sections = [
    { id: 1, name: 'Leadership et Vision', score: result.section1Score },
    { id: 2, name: 'Communication et Relations Interpersonnelles', score: result.section2Score },
    { id: 3, name: 'Gestion des Performances et Développement des Talents', score: result.section3Score },
    { id: 4, name: 'Gestion du Changement et Innovation', score: result.section4Score },
    { id: 5, name: 'Prise de Décision et Résolution de Problème', score: result.section5Score },
    { id: 6, name: 'Gestion du Temps et des Priorités', score: result.section6Score },
    { id: 7, name: 'Compétences Techniques et Opérationnelles', score: result.section7Score },
    { id: 8, name: 'Engagement et Esprit d\'Équipe', score: result.section8Score },
    { id: 9, name: 'Intelligence Émotionnelle', score: result.section9Score },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--navy)' }}>
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Adaepro</div>
              <div className="text-xs text-gray-500">Vos Résultats</div>
            </div>
          </div>
          <Button
            onClick={handleDownloadPDF}
            className="text-white"
            style={{ backgroundColor: 'var(--red)' }}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le rapport PDF
          </Button>
        </div>

        {/* Score Global */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--red)' }} />
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
                Félicitations {result.candidate.firstName} !
              </h1>
              <p className="text-gray-600 mb-6">Vous avez complété l'évaluation de vos compétences managériales</p>
              <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-red-50 rounded-lg">
                <div className="text-6xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
                  {result.percentageScore.toFixed(1)}%
                </div>
                <div className="text-lg text-gray-600">Score Global</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graphique Radar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle style={{ color: 'var(--navy)' }}>Profil de Compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#E30613"
                    fill="#E30613"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scores Détaillés par Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle style={{ color: 'var(--navy)' }}>Scores Détaillés par Dimension</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sections.map((section) => {
                const percentage = ((section.score / 45) * 100).toFixed(1);
                const percentageNum = parseFloat(percentage);
                
                return (
                  <div key={section.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{section.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
                          {percentage}%
                        </span>
                        {percentageNum >= 80 && (
                          <Award className="w-5 h-5" style={{ color: 'var(--red)' }} />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: percentageNum >= 80 ? '#E30613' : percentageNum >= 60 ? '#0a2b4c' : '#6b7280'
                        }}
                      />
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {percentageNum >= 80 ? '⭐ Point fort - Excellente maîtrise' : 
                       percentageNum >= 60 ? '✓ Compétence solide' :
                       percentageNum >= 40 ? '→ Axe de développement' :
                       '⚠ Priorité de développement'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Styles de Management */}
        {result.managementStyles && Object.keys(result.managementStyles).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle style={{ color: 'var(--navy)' }}>Styles de Management Observés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(result.managementStyles)
                  .filter(([_, score]) => (score as number) > 0)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .map(([style, score]) => (
                    <div key={style} className="p-4 border rounded-lg">
                      <div className="font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                        {style}
                      </div>
                      <div className="text-sm text-gray-600">
                        {score === 1 ? 'Le plus présent' : score === 2 ? 'Assez souvent' : 'De temps en temps'}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rapport Narratif */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle style={{ color: 'var(--navy)' }}>Rapport Narratif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">
                {result.narrativeReport}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleDownloadPDF}
            size="lg"
            className="text-white"
            style={{ backgroundColor: 'var(--red)' }}
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger le rapport complet (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}
