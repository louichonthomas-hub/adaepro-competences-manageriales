'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Award, TrendingUp, AlertTriangle, Target, Lightbulb, ShieldAlert, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';

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

const COMPETENCE_DIMENSIONS = [
  { id: 1, name: 'Leadership et Vision', shortName: 'Leadership', maxScore: 100 },
  { id: 2, name: 'Communication et Relations Interpersonnelles', shortName: 'Communication', maxScore: 100 },
  { id: 3, name: 'Gestion des Performances et Développement des Talents', shortName: 'Performances', maxScore: 100 },
  { id: 4, name: 'Gestion du Changement et Innovation', shortName: 'Changement', maxScore: 100 },
  { id: 5, name: 'Prise de Décision et Résolution de Problème', shortName: 'Décision', maxScore: 100 },
  { id: 6, name: 'Gestion du Temps et des Priorités', shortName: 'Temps', maxScore: 100 },
  { id: 7, name: 'Compétences Techniques et Opérationnelles', shortName: 'Technique', maxScore: 100 },
  { id: 8, name: 'Engagement et Esprit d\'Équipe', shortName: 'Équipe', maxScore: 100 },
  { id: 9, name: 'Intelligence Émotionnelle', shortName: 'Intelligence Émot.', maxScore: 100 },
];

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

    fetch(`/api/test-result?candidateId=${candidateId}`)
      .then(res => {
        if (!res.ok) throw new Error('No results found');
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
    alert('La génération PDF sera implémentée dans la prochaine phase');
  };

  if (isLoading || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        <Loader2 className="w-12 h-12 animate-spin text-amber-400" />
      </div>
    );
  }

  // Préparer les scores par section
  const sectionScores = [
    { id: 1, name: 'Leadership et Vision', shortName: 'Leadership', score: result.section1Score },
    { id: 2, name: 'Communication', shortName: 'Communication', score: result.section2Score },
    { id: 3, name: 'Gestion des Performances', shortName: 'Performances', score: result.section3Score },
    { id: 4, name: 'Changement et Innovation', shortName: 'Changement', score: result.section4Score },
    { id: 5, name: 'Prise de Décision', shortName: 'Décision', score: result.section5Score },
    { id: 6, name: 'Gestion du Temps', shortName: 'Temps', score: result.section6Score },
    { id: 7, name: 'Compétences Techniques', shortName: 'Technique', score: result.section7Score },
    { id: 8, name: 'Esprit d\'Équipe', shortName: 'Équipe', score: result.section8Score },
    { id: 9, name: 'Intelligence Émotionnelle', shortName: 'Int. Émotionnelle', score: result.section9Score },
  ];

  // Identifier forces et axes de développement
  const strongPoints = sectionScores.filter(s => s.score >= 75).sort((a, b) => b.score - a.score);
  const developmentAreas = sectionScores.filter(s => s.score < 60).sort((a, b) => a.score - b.score);
  const vigilancePoints = sectionScores.filter(s => s.score >= 40 && s.score < 60).sort((a, b) => a.score - b.score);

  // Données pour graphique radar
  const radarData = sectionScores.map(s => ({
    competence: s.shortName,
    score: s.score,
    fullMark: 100
  }));

  // Données pour graphique à barres
  const barData = [...sectionScores].sort((a, b) => b.score - a.score);

  // Couleurs pour les barres
  const getBarColor = (score: number) => {
    if (score >= 75) return '#F59E0B'; // Amber
    if (score >= 60) return '#3B82F6'; // Blue
    return '#94A3B8'; // Slate
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header avec logo */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-16">
                <Image src="/logo.png" alt="Adaepro" fill className="object-contain" />
              </div>
              <div className="border-l-2 border-amber-500 pl-4">
                <div className="text-2xl font-bold text-slate-900">Rapport d'Évaluation</div>
                <div className="text-sm text-slate-600">Compétences Managériales Premium</div>
              </div>
            </div>
            <Button
              onClick={handleDownloadPDF}
              className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>

        {/* Carte de synthèse exécutive */}
        <Card className="mb-8 border-0 shadow-2xl bg-gradient-to-br from-white to-amber-50">
          <CardContent className="p-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
                <Award className="w-12 h-12 text-amber-600" />
              </div>
              <h1 className="text-4xl font-bold mb-3 text-slate-900">
                {result.candidate.firstName} {result.candidate.lastName}
              </h1>
              {result.candidate.company && (
                <p className="text-lg text-slate-600 mb-6">{result.candidate.company}</p>
              )}
              
              <div className="inline-block p-10 rounded-2xl border-4 border-amber-500 bg-white shadow-xl mb-6">
                <div className="text-7xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                  {result.percentageScore}%
                </div>
                <div className="text-xl font-semibold text-slate-700">Score Global de Compétence</div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-amber-500">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{strongPoints.length}</div>
                  <div className="text-sm font-medium text-slate-600">Points Forts Identifiés</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-gray-500">
                  <div className="text-3xl font-bold text-gray-600 mb-2">{vigilancePoints.length}</div>
                  <div className="text-sm font-medium text-slate-600">Points de Vigilance</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-slate-500">
                  <div className="text-3xl font-bold text-slate-600 mb-2">{developmentAreas.length}</div>
                  <div className="text-sm font-medium text-slate-600">Axes de Développement</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graphiques côte à côte */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Graphique Radar */}
          <Card className="border-0 shadow-2xl bg-white">
            <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-white">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <BarChart3 className="w-6 h-6 text-amber-600" />
                Profil de Compétences (Radar)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <PolarAngleAxis 
                      dataKey="competence" 
                      tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      stroke="#cbd5e1"
                    />
                    <Radar
                      name="Votre Score"
                      dataKey="score"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.7}
                      strokeWidth={3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #F59E0B',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Graphique à Barres */}
          <Card className="border-0 shadow-2xl bg-white">
            <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-white">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <TrendingUp className="w-6 h-6 text-amber-600" />
                Classement des Compétences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ left: 100, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                    <YAxis 
                      dataKey="shortName" 
                      type="category" 
                      stroke="#64748b"
                      tick={{ fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #F59E0B',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scores détaillés par dimension */}
        <Card className="mb-8 border-0 shadow-2xl bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-white">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Sparkles className="w-6 h-6 text-amber-600" />
              Analyse Détaillée par Dimension
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {sectionScores.map((section) => {
                const percentage = section.score;
                let status = '';
                let statusIcon = null;
                let statusColor = '';
                
                if (percentage >= 75) {
                  status = 'Excellence - Point Fort';
                  statusIcon = <Award className="w-5 h-5 text-amber-500" />;
                  statusColor = 'text-amber-700';
                } else if (percentage >= 60) {
                  status = 'Compétence Solide';
                  statusIcon = <CheckCircle2 className="w-5 h-5 text-gray-500" />;
                  statusColor = 'text-gray-700';
                } else {
                  status = 'Axe de Développement Prioritaire';
                  statusIcon = <Target className="w-5 h-5 text-slate-500" />;
                  statusColor = 'text-slate-700';
                }
                
                return (
                  <div key={section.id} className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{section.name}</h3>
                        <div className={`flex items-center gap-2 ${statusColor} font-semibold text-sm`}>
                          {statusIcon}
                          <span>{status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-4 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${percentage}%`,
                          background: percentage >= 75 
                            ? 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)'
                            : percentage >= 60 
                            ? 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)'
                            : 'linear-gradient(90deg, #94A3B8 0%, #CBD5E1 100%)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Points Forts */}
        {strongPoints.length > 0 && (
          <Card className="mb-8 border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-white">
            <CardHeader className="border-b bg-gradient-to-r from-amber-100 to-amber-50">
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Award className="w-7 h-7 text-amber-600" />
                Vos Points Forts – Zones d'Excellence
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                Vous excellez dans les domaines suivants, constituant ainsi les piliers de votre efficacité managériale. 
                Ces compétences remarquables vous distinguent et représentent vos atouts stratégiques dans votre rôle de manager.
              </p>
              <div className="space-y-6">
                {strongPoints.map((point, index) => (
                  <div key={point.id} className="bg-white rounded-xl p-6 border-l-4 border-amber-500 shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-xl font-bold text-amber-700">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-slate-900">{point.name}</h3>
                          <span className="text-3xl font-bold text-amber-600">{point.score}%</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {point.id === 1 && "Votre capacité à définir une vision claire et à inspirer vos équipes constitue un atout majeur. Vous savez mobiliser et fédérer efficacement autour d'objectifs communs, créant ainsi une dynamique positive et porteuse de sens."}
                          {point.id === 2 && "Votre excellence en communication interpersonnelle vous permet d'établir des relations de confiance durables. Cette compétence essentielle crée un climat de travail positif où le dialogue et la collaboration s'épanouissent naturellement."}
                          {point.id === 3 && "Vous maîtrisez remarquablement l'art de développer les talents. Votre approche structurée de l'évaluation et du développement des compétences contribue directement à la croissance et à la performance globale de votre équipe."}
                          {point.id === 4 && "Votre agilité face au changement et votre capacité à innover sont des atouts précieux. Vous accompagnez vos équipes dans les transformations avec assurance, transformant les défis en opportunités de progression."}
                          {point.id === 5 && "Votre processus décisionnel est structuré et réfléchi. Vous excellez dans l'analyse des situations complexes et prenez des décisions éclairées, même dans l'incertitude, inspirant confiance à votre entourage."}
                          {point.id === 6 && "Votre gestion du temps et des priorités est exemplaire. Cette compétence vous permet d'optimiser votre efficacité personnelle et celle de votre équipe, maintenant le cap face aux multiples sollicitations quotidiennes."}
                          {point.id === 7 && "Vos compétences techniques et opérationnelles solides vous confèrent une crédibilité importante. Cette expertise vous permet d'intervenir efficacement sur le terrain et de guider votre équipe avec assurance."}
                          {point.id === 8 && "Votre capacité à créer et maintenir l'engagement au sein de votre équipe est remarquable. Vous cultivez l'esprit d'équipe et mobilisez les énergies collectives, créant un environnement où chacun se sent valorisé et motivé."}
                          {point.id === 9 && "Votre intelligence émotionnelle élevée vous permet de comprendre et gérer finement vos émotions ainsi que celles de vos collaborateurs. Cette compétence rare crée un environnement de travail harmonieux et psychologiquement sécurisé."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-yellow-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-lg text-amber-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Recommandation Stratégique
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Capitalisez sur ces forces en les rendant visibles dans votre organisation. Partagez votre expertise à travers le mentorat, 
                  la formation ou des projets transversaux. Vos points forts constituent votre signature managériale distinctive – cultivez-les 
                  et faites-en des leviers d'influence et d'impact accrus.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Points de Vigilance */}
        {vigilancePoints.length > 0 && (
          <Card className="mb-8 border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="border-b bg-gradient-to-r from-gray-100 to-gray-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ShieldAlert className="w-7 h-7 text-gray-600" />
                Points de Vigilance – Compétences à Consolider
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                Ces dimensions représentent des compétences déjà établies qui méritent néanmoins une attention particulière pour atteindre l'excellence. 
                Un investissement ciblé vous permettra de transformer ces compétences solides en véritables points forts.
              </p>
              <div className="space-y-6">
                {vigilancePoints.map((point, index) => (
                  <div key={point.id} className="bg-white rounded-xl p-6 border-l-4 border-gray-500 shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-slate-900">{point.name}</h3>
                          <span className="text-3xl font-bold text-gray-600">{point.score}%</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed mb-4">
                          Cette compétence est déjà bien présente dans votre pratique managériale. Pour la porter au niveau d'excellence, 
                          concentrez-vous sur des ajustements ciblés et des pratiques plus régulières.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-2">Actions Recommandées :</h4>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
                            <li>Sollicitez du feedback régulier de vos pairs et collaborateurs</li>
                            <li>Identifiez 2-3 situations concrètes où renforcer cette pratique</li>
                            <li>Observez des managers reconnus pour leur excellence dans ce domaine</li>
                            <li>Pratiquez avec intention et suivez vos progrès mensuellement</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Axes de Développement Prioritaires */}
        {developmentAreas.length > 0 && (
          <Card className="mb-8 border-0 shadow-2xl bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="border-b bg-gradient-to-r from-slate-100 to-slate-50">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Target className="w-7 h-7 text-slate-600" />
                Axes de Développement Prioritaires – Opportunités de Croissance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                Ces dimensions représentent vos opportunités de croissance les plus significatives. En investissant dans leur développement, 
                vous élargirez considérablement votre impact managérial et votre palette de compétences. Chaque compétence peut se développer 
                avec de la pratique structurée et un accompagnement adapté.
              </p>
              <div className="space-y-8">
                {developmentAreas.map((point, index) => (
                  <div key={point.id} className="bg-white rounded-xl p-8 border-l-4 border-slate-500 shadow-lg">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-slate-300">
                        <span className="text-2xl font-bold text-slate-700">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-bold text-slate-900">{point.name}</h3>
                          <span className="text-4xl font-bold text-slate-600">{point.score}%</span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 mb-6">
                          <h4 className="font-bold text-slate-900 mb-3 text-lg">Pourquoi c'est important :</h4>
                          <p className="text-slate-700 leading-relaxed">
                            {point.id === 1 && "Le leadership et la vision sont les fondements de votre capacité à influencer et à mobiliser. Renforcer cette dimension vous permettra d'accroître significativement votre impact et de mieux fédérer vos équipes autour d'une direction claire et inspirante."}
                            {point.id === 2 && "La communication et les relations interpersonnelles sont au cœur de votre efficacité managériale. Développer cette compétence améliorera la qualité de vos échanges, renforcera la confiance et facilitera la résolution collaborative des défis."}
                            {point.id === 3 && "La gestion des performances et le développement des talents sont essentiels à la réussite collective. Investir dans cette dimension vous permettra de maximiser le potentiel de chaque collaborateur et d'élever les standards de performance de votre équipe."}
                            {point.id === 4 && "Dans un environnement en constante évolution, la capacité à gérer le changement et à innover devient cruciale. Développer cette agilité vous permettra d'anticiper les transformations et de positionner votre équipe favorablement pour l'avenir."}
                            {point.id === 5 && "La qualité de vos décisions influence directement les résultats de votre équipe. Renforcer vos compétences décisionnelles vous permettra d'être plus efficace dans les situations complexes et d'inspirer davantage confiance à vos parties prenantes."}
                            {point.id === 6 && "L'optimisation du temps et des priorités a un impact direct sur votre efficacité et celle de votre équipe. Maîtriser cette dimension vous libérera pour vous concentrer sur les activités à plus forte valeur ajoutée et réduira votre stress opérationnel."}
                            {point.id === 7 && "Les compétences techniques et opérationnelles renforcent votre crédibilité et votre capacité à accompagner votre équipe sur le terrain. Développer cette expertise vous permettra d'intervenir plus efficacement et de guider avec assurance."}
                            {point.id === 8 && "L'engagement et l'esprit d'équipe transforment la dynamique collective et les résultats. Investir dans cette dimension créera un environnement où chacun se sent valorisé, motivé et partie prenante du succès commun."}
                            {point.id === 9 && "L'intelligence émotionnelle est la clé des relations managériales réussies. Renforcer cette compétence vous permettra de mieux gérer les situations relationnelles complexes, de créer un climat de confiance et de développer votre leadership authentique."}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-5 border border-amber-200">
                            <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                              <Lightbulb className="w-5 h-5" />
                              Plan d'Actions Court Terme (0-3 mois)
                            </h4>
                            <ul className="space-y-2 text-slate-700 text-sm">
                              <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>Identifiez un mentor ou coach spécialisé dans ce domaine</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>Lisez 1-2 ouvrages de référence sur la compétence</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>Pratiquez dans des situations à faible enjeu</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>Sollicitez du feedback après chaque pratique</span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5" />
                              Plan d'Actions Moyen Terme (3-12 mois)
                            </h4>
                            <ul className="space-y-2 text-slate-700 text-sm">
                              <li className="flex items-start gap-2">
                                <span className="text-gray-500 font-bold">•</span>
                                <span>Suivez une formation certifiante dans ce domaine</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-gray-500 font-bold">•</span>
                                <span>Pilotez un projet mobilisant cette compétence</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-gray-500 font-bold">•</span>
                                <span>Établissez des rituels de pratique régulière</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-gray-500 font-bold">•</span>
                                <span>Mesurez vos progrès avec des indicateurs précis</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl border-2 border-slate-300">
                <h4 className="font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  Principe Clé pour votre Développement
                </h4>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Concentrez-vous sur <strong className="text-amber-600">1 à 2 axes prioritaires</strong> pendant les 6 prochains mois plutôt que de disperser vos efforts. 
                  Un développement ciblé et en profondeur produira des résultats bien plus significatifs et durables qu'une approche superficielle sur plusieurs fronts. 
                  La constance et la pratique délibérée sont les clés de la transformation durable.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Synthèse et Conclusion */}
        <Card className="mb-8 border-0 shadow-2xl bg-gradient-to-br from-white via-amber-50 to-white">
          <CardHeader className="border-b bg-gradient-to-r from-amber-100 to-white">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Award className="w-7 h-7 text-amber-600" />
              Synthèse et Recommandations Stratégiques
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Votre Profil Managérial</h3>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                {result.percentageScore >= 75 
                  ? "Votre profil managérial témoigne d'une maîtrise avancée des compétences essentielles au leadership. Vos points forts constituent une base solide d'excellence sur laquelle vous pouvez vous appuyer pour avoir un impact significatif. Les quelques axes de développement identifiés représentent des opportunités ciblées pour atteindre un niveau d'expertise encore plus élevé."
                  : result.percentageScore >= 60
                  ? "Votre profil managérial révèle un équilibre intéressant entre compétences établies et opportunités de croissance. Vous disposez de fondations solides qui, combinées à un investissement ciblé dans vos axes de développement, vous permettront d'élever significativement votre impact et votre efficacité managériale."
                  : "Votre profil managérial indique un potentiel de développement important. Cette évaluation constitue un point de départ précieux pour construire méthodiquement vos compétences managériales. En vous concentrant sur les axes prioritaires et en vous entourant de soutien adapté, vous pourrez progresser de manière substantielle et rapide."
                }
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Vos Priorités de Développement</h3>
              <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">1</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Capitalisez sur vos Forces</h4>
                      <p className="text-slate-700">Continuez à développer et affiner vos compétences les plus solides. Ce sont elles qui constituent votre signature managériale distinctive et votre principal levier d'influence.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">2</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Priorisez Stratégiquement</h4>
                      <p className="text-slate-700">Sélectionnez 1-2 axes de développement prioritaires pour les 6 prochains mois. Concentrez-y votre énergie pour obtenir des résultats tangibles et mesurables.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">3</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Pratiquez avec Intention</h4>
                      <p className="text-slate-700">Créez des opportunités de pratique délibérée dans vos activités quotidiennes. Le développement de compétences nécessite une application régulière et consciente dans des contextes variés.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">4</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Sollicitez du Soutien</h4>
                      <p className="text-slate-700">Entourez-vous de mentors, coachs ou pairs qui peuvent vous accompagner dans votre développement. Le feedback régulier et le soutien externe accélèrent significativement la progression.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">5</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Mesurez vos Progrès</h4>
                      <p className="text-slate-700">Établissez des indicateurs concrets pour suivre votre évolution. Réévaluez vos compétences régulièrement (tous les 6-12 mois) pour ajuster votre trajectoire de développement.</p>
                    </div>
                  </li>
                </ol>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Prochaines Étapes Recommandées</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-md">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Cette Semaine</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Partagez vos résultats avec votre manager ou RH</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Identifiez vos 2 axes de développement prioritaires</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Bloquez 2h dans votre agenda pour élaborer votre plan</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-md">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Ce Mois-ci</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Identifiez un mentor ou coach pour vous accompagner</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Inscrivez-vous à une formation sur votre axe prioritaire</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Commencez à pratiquer dans des situations concrètes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer / CTA */}
        <div className="text-center">
          <Button
            onClick={handleDownloadPDF}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg px-10 py-6 shadow-2xl"
          >
            <Download className="w-6 h-6 mr-3" />
            Télécharger le Rapport Complet (PDF)
          </Button>
          <p className="text-slate-300 mt-4">
            Conservez ce rapport et revisitez-le dans 6 mois pour mesurer vos progrès
          </p>
        </div>

      </div>
    </div>
  );
}
