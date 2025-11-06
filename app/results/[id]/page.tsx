
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip, Label } from 'recharts';

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
  narrativeReport: string | null;
  candidate: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    company: string | null;
  };
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const candidateId = params.id;

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

  // Générer l'analyse narrative basée sur les scores
  const generateNarrative = () => {
    if (!result) return '';

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

    const strongPoints = sections.filter(s => s.score >= 70).sort((a, b) => b.score - a.score);
    const solidPoints = sections.filter(s => s.score >= 60 && s.score < 70).sort((a, b) => b.score - a.score);
    const developmentAreas = sections.filter(s => s.score < 60).sort((a, b) => a.score - b.score);

    let narrative = `## Analyse de votre profil managérial\n\n`;
    narrative += `Avec un score global de **${result.percentageScore}%**, votre profil managérial révèle un ensemble de compétences diversifiées qui constituent une base solide pour votre développement professionnel.\n\n`;

    // Points forts
    if (strongPoints.length > 0) {
      narrative += `### 🌟 Vos Points Forts (Excellence)\n\n`;
      narrative += `Vous excellez particulièrement dans les domaines suivants :\n\n`;
      strongPoints.forEach(point => {
        narrative += `**${point.name}** (${point.score}%) : `;
        if (point.id === 1) narrative += `Vous démontrez une capacité remarquable à définir une vision claire et à inspirer vos équipes. Votre leadership est un atout majeur qui vous permet de mobiliser et de fédérer efficacement autour d'objectifs communs.\n\n`;
        else if (point.id === 2) narrative += `Votre excellence en communication interpersonnelle vous permet d'établir des relations de confiance et de maintenir un dialogue ouvert avec vos collaborateurs. Cette compétence est essentielle pour créer un climat de travail positif.\n\n`;
        else if (point.id === 3) narrative += `Vous maîtrisez remarquablement l'art de développer les talents. Votre approche structurée de l'évaluation et du développement des compétences contribue directement à la performance globale de votre équipe.\n\n`;
        else if (point.id === 4) narrative += `Votre agilité face au changement et votre capacité à innover sont des atouts précieux dans l'environnement professionnel actuel. Vous savez accompagner vos équipes dans les transformations.\n\n`;
        else if (point.id === 5) narrative += `Votre processus décisionnel est structuré et réfléchi. Vous savez analyser les situations complexes et prendre des décisions éclairées, même dans l'incertitude.\n\n`;
        else if (point.id === 6) narrative += `Votre gestion du temps et des priorités est exemplaire. Cette compétence vous permet d'optimiser votre efficacité et celle de votre équipe face aux multiples sollicitations.\n\n`;
        else if (point.id === 7) narrative += `Vos compétences techniques et opérationnelles sont solides. Cette expertise vous confère une crédibilité importante auprès de vos équipes et vous permet d'intervenir efficacement sur les aspects opérationnels.\n\n`;
        else if (point.id === 8) narrative += `Votre capacité à créer et maintenir l'engagement au sein de votre équipe est remarquable. Vous savez cultiver l'esprit d'équipe et mobiliser les énergies collectives.\n\n`;
        else if (point.id === 9) narrative += `Votre intelligence émotionnelle élevée vous permet de comprendre et gérer efficacement vos émotions ainsi que celles de vos collaborateurs, créant ainsi un environnement de travail harmonieux.\n\n`;
      });
    }

    // Compétences solides
    if (solidPoints.length > 0) {
      narrative += `### ✅ Vos Compétences Solides\n\n`;
      narrative += `Vous disposez également de compétences bien établies dans :\n\n`;
      solidPoints.forEach(point => {
        narrative += `**${point.name}** (${point.score}%) : Une base solide sur laquelle vous pouvez vous appuyer. Ces compétences sont bien maîtrisées et vous permettent d'être efficace dans votre rôle managérial.\n\n`;
      });
    }

    // Axes de développement
    if (developmentAreas.length > 0) {
      narrative += `### 📈 Vos Axes de Développement Prioritaires\n\n`;
      narrative += `Pour optimiser votre impact managérial, nous avons identifié les domaines suivants comme priorités de développement :\n\n`;
      developmentAreas.forEach(point => {
        narrative += `**${point.name}** (${point.score}%) : `;
        if (point.id === 1) narrative += `Renforcer votre leadership et votre capacité à communiquer une vision claire vous permettra d'accroître votre influence et de mieux mobiliser vos équipes autour d'objectifs communs. Nous vous recommandons de participer à des formations en leadership stratégique.\n\n`;
        else if (point.id === 2) narrative += `Développer vos compétences en communication et relations interpersonnelles améliorera significativement la qualité de vos échanges et renforcera la confiance au sein de votre équipe. L'écoute active et l'assertivité sont des leviers clés.\n\n`;
        else if (point.id === 3) narrative += `Investir dans le développement de vos compétences en gestion des performances vous permettra de mieux accompagner vos collaborateurs dans leur évolution. La pratique du feedback régulier et la mise en place d'objectifs SMART sont essentiels.\n\n`;
        else if (point.id === 4) narrative += `Améliorer votre capacité à gérer le changement et à promouvoir l'innovation vous aidera à mieux anticiper et accompagner les transformations. Développez votre agilité managériale et votre ouverture aux nouvelles approches.\n\n`;
        else if (point.id === 5) narrative += `Renforcer vos compétences en prise de décision vous permettra d'être plus efficace dans les situations complexes. Travaillez sur vos méthodes d'analyse et n'hésitez pas à impliquer votre équipe dans les processus décisionnels.\n\n`;
        else if (point.id === 6) narrative += `Optimiser votre gestion du temps et des priorités aura un impact direct sur votre efficacité et celle de votre équipe. Explorez les méthodes de priorisation et apprenez à déléguer efficacement.\n\n`;
        else if (point.id === 7) narrative += `Développer vos compétences techniques et opérationnelles renforcera votre crédibilité et votre capacité à accompagner votre équipe sur le terrain. Une montée en compétence ciblée est recommandée.\n\n`;
        else if (point.id === 8) narrative += `Investir dans le développement de l'engagement et de l'esprit d'équipe transformera la dynamique collective. Organisez des moments d'échange, valorisez les réussites et créez un sentiment d'appartenance fort.\n\n`;
        else if (point.id === 9) narrative += `Renforcer votre intelligence émotionnelle vous permettra de mieux gérer les situations relationnelles complexes et de créer un climat de confiance. La gestion du stress et l'empathie sont des compétences clés à développer.\n\n`;
      });
    }

    // Recommandations
    narrative += `### 🎯 Recommandations pour votre Développement\n\n`;
    narrative += `Pour maximiser votre potentiel managérial, nous vous recommandons de :\n\n`;
    narrative += `1. **Capitaliser sur vos forces** : Continuez à développer et à affiner vos compétences les plus solides, qui constituent votre signature managériale distinctive.\n\n`;
    narrative += `2. **Prioriser vos axes de développement** : Concentrez-vous sur 2-3 compétences prioritaires à développer sur les 6 prochains mois, en commençant par celles qui auront le plus d'impact sur votre efficacité.\n\n`;
    narrative += `3. **Solliciter du feedback** : Demandez régulièrement à vos collaborateurs, pairs et supérieurs leur perception de vos pratiques managériales pour identifier vos angles morts.\n\n`;
    narrative += `4. **Vous former continuellement** : Participez à des formations, séminaires ou coaching dans les domaines identifiés comme prioritaires.\n\n`;
    narrative += `5. **Pratiquer régulièrement** : Mettez en application immédiatement les nouvelles compétences acquises dans votre contexte professionnel quotidien.\n\n`;
    
    narrative += `### 🚀 Conclusion\n\n`;
    if (result.percentageScore >= 70) {
      narrative += `Votre profil managérial est très solide et démontre une maîtrise avancée de nombreuses dimensions essentielles. En continuant à vous développer dans les quelques axes identifiés, vous renforcerez encore davantage votre impact et votre efficacité en tant que manager. Vous avez tous les atouts pour exceller dans votre rôle et inspirer votre équipe vers l'excellence.`;
    } else if (result.percentageScore >= 60) {
      narrative += `Votre profil managérial révèle un bon niveau de compétences avec des bases solides sur lesquelles construire. En travaillant sur les axes de développement identifiés, vous pourrez significativement accroître votre impact et votre efficacité. Votre potentiel est réel et mérite d'être cultivé pour atteindre l'excellence managériale.`;
    } else {
      narrative += `Votre profil managérial montre un potentiel à développer. Cette évaluation est une opportunité précieuse pour identifier clairement les domaines à renforcer. En vous concentrant sur les axes prioritaires et en vous engageant dans un parcours de développement structuré, vous pourrez rapidement progresser et gagner en efficacité managériale. Chaque compétence peut se développer avec de la pratique et de l'accompagnement.`;
    }

    return narrative;
  };

  if (isLoading || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--navy)' }} />
      </div>
    );
  }

  // Préparer les données pour le graphique radar
  const radarChartData = result.radarData || [
    { competence: 'Leadership', score: result.section1Score },
    { competence: 'Communication', score: result.section2Score },
    { competence: 'Performances', score: result.section3Score },
    { competence: 'Changement', score: result.section4Score },
    { competence: 'Décision', score: result.section5Score },
    { competence: 'Temps', score: result.section6Score },
    { competence: 'Technique', score: result.section7Score },
    { competence: 'Équipe', score: result.section8Score },
    { competence: 'Intelligence Émot.', score: result.section9Score },
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

  const narrativeText = generateNarrative();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white">
              <span className="font-bold text-xl" style={{ color: 'var(--navy)' }}>A</span>
            </div>
            <div>
              <div className="font-bold text-lg text-white">Adaepro</div>
              <div className="text-xs text-blue-200">Vos Résultats</div>
            </div>
          </div>
          <Button
            onClick={handleDownloadPDF}
            className="text-white hover:opacity-90"
            style={{ backgroundColor: '#FF8C00' }}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le rapport PDF
          </Button>
        </div>

        {/* Score Global */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardContent className="p-8">
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: '#FF8C00' }} />
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
                Félicitations {result.candidate.firstName || 'Candidat'} !
              </h1>
              <p className="text-gray-600 mb-6">Vous avez complété l'évaluation de vos compétences managériales</p>
              <div className="inline-block p-8 rounded-lg border-4" style={{ borderColor: '#FF8C00', backgroundColor: '#FFF5E6' }}>
                <div className="text-6xl font-bold mb-2" style={{ color: '#FF8C00' }}>
                  {result.percentageScore}%
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--navy)' }}>Score Global</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graphique Radar */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle style={{ color: 'var(--navy)' }}>Profil de Compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis 
                    dataKey="competence" 
                    tick={{ fill: '#1e3a8a', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    stroke="#cbd5e1"
                  />
                  <Radar
                    name="Score (%)"
                    dataKey="score"
                    stroke="#FF8C00"
                    fill="#FF8C00"
                    fillOpacity={0.6}
                    strokeWidth={2}
                    label={{ fill: '#1e3a8a', fontSize: 14, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #FF8C00',
                      borderRadius: '8px',
                      color: '#1e3a8a'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ color: '#1e3a8a' }}
                    iconType="circle"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scores Détaillés par Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle style={{ color: 'var(--navy)' }}>Scores Détaillés par Dimension</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sections.map((section) => {
                const percentage = section.score;
                
                return (
                  <div key={section.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: 'var(--navy)' }}>{section.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold" style={{ color: '#FF8C00' }}>
                          {percentage}%
                        </span>
                        {percentage >= 70 && (
                          <Award className="w-5 h-5" style={{ color: '#FFD700' }} />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: percentage >= 70 ? '#FF8C00' : percentage >= 60 ? '#FFA500' : '#FFD700'
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {percentage >= 70 ? (
                        <div className="flex items-center gap-1" style={{ color: '#059669' }}>
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-base font-medium">Point fort - Excellente maîtrise</span>
                        </div>
                      ) : percentage >= 60 ? (
                        <div className="flex items-center gap-1" style={{ color: '#3b82f6' }}>
                          <Award className="w-4 h-4" />
                          <span className="text-base font-medium">Compétence solide</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1" style={{ color: '#f59e0b' }}>
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-base font-medium">Axe de développement</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Analyse Détaillée */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--navy)' }}>
              <TrendingUp className="w-6 h-6" />
              Analyse Approfondie de votre Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="prose max-w-none">
                {narrativeText.split('\n').map((line, index) => {
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mt-6 mb-3" style={{ color: '#FF8C00' }}>{line.replace('### ', '')}</h3>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-4 mb-4" style={{ color: 'var(--navy)' }}>{line.replace('## ', '')}</h2>;
                  } else if (line.includes('**') && line.includes('%')) {
                    const parts = line.split('**');
                    return (
                      <p key={index} className="mb-3 leading-relaxed text-gray-700">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i} style={{ color: '#FF8C00' }}>{part}</strong> : part
                        )}
                      </p>
                    );
                  } else if (line.trim() !== '') {
                    return <p key={index} className="mb-3 leading-relaxed text-gray-700">{line}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Styles de Management */}
        {result.managementStyles && typeof result.managementStyles === 'object' && Object.keys(result.managementStyles).length > 0 && (
          <Card className="mb-8 border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle style={{ color: 'var(--navy)' }}>Styles de Management Observés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(result.managementStyles)
                  .filter(([_, score]) => (score as number) > 0)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .map(([style, score]) => (
                    <div key={style} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
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

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleDownloadPDF}
            size="lg"
            className="text-white hover:opacity-90 shadow-lg"
            style={{ backgroundColor: '#FF8C00' }}
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger le rapport complet (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}
