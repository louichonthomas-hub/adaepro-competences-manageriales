
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, ChevronLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Question {
  id: number;
  text: string;
  sectionId: number;
  sectionTitle: string;
  originalIndex: number;
}

interface TestData {
  sections: {
    id: number;
    title: string;
    questions: { id: number; text: string }[];
  }[];
  scale: {
    labels: { [key: string]: string };
  };
}

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams?.get('candidateId');

  const [testData, setTestData] = useState<TestData | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  useEffect(() => {
    if (!candidateId) {
      router.push('/identification');
      return;
    }

    // Charger les données du test
    fetch('/test_data.json')
      .then(res => res.json())
      .then(data => {
        setTestData(data);
        
        // Créer un tableau plat de toutes les questions avec leur section
        const questions: Question[] = [];
        data.sections.forEach((section: any) => {
          section.questions.forEach((q: any, qIndex: number) => {
            questions.push({
              id: q.id,
              text: q.text,
              sectionId: section.id,
              sectionTitle: section.title,
              originalIndex: qIndex
            });
          });
        });
        
        // Mélanger les questions (Fisher-Yates shuffle)
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        
        setAllQuestions(questions);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading test data:', err);
        setIsLoading(false);
      });

    // Charger la progression sauvegardée
    fetch(`/api/test-progress?candidateId=${candidateId}`)
      .then(res => res.json())
      .then(progress => {
        if (progress.answers && Object.keys(progress.answers).length > 0) {
          setAnswers(progress.answers);
        }
        if (progress.currentQuestion !== undefined) {
          setCurrentQuestionIndex(progress.currentQuestion);
        }
      })
      .catch(err => console.error('Error loading progress:', err));
  }, [candidateId, router]);

  const saveProgress = async (completed = false) => {
    if (!candidateId) return;

    setIsSaving(true);
    try {
      await fetch('/api/test-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          currentQuestion: currentQuestionIndex,
          answers,
          completed,
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswer = async (value: number) => {
    if (isAutoAdvancing) return;
    
    const currentQuestion = allQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    const questionKey = `${currentQuestion.sectionId}-${currentQuestion.originalIndex}`;
    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);

    // Auto-avancer après 600ms
    setIsAutoAdvancing(true);
    setTimeout(async () => {
      await saveProgress();
      
      if (currentQuestionIndex < allQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Terminer le test
        await handleSubmit(newAnswers);
      }
      setIsAutoAdvancing(false);
    }, 600);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isAutoAdvancing) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (finalAnswers?: Record<string, number>) => {
    if (!candidateId || !testData) return;

    setIsSaving(true);
    try {
      const answersToSubmit = finalAnswers || answers;
      
      // Réorganiser les réponses par section
      const sectionAnswers: Record<number, number[]> = {};
      testData.sections.forEach(section => {
        sectionAnswers[section.id] = Array(section.questions.length).fill(0);
      });

      Object.entries(answersToSubmit).forEach(([key, value]) => {
        const [sectionId, questionIndex] = key.split('-').map(Number);
        if (sectionAnswers[sectionId]) {
          sectionAnswers[sectionId][questionIndex] = value;
        }
      });

      // Calculer et sauvegarder les résultats
      await fetch('/api/test-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          answers: sectionAnswers,
        }),
      });

      // Marquer comme complété
      await saveProgress(true);

      // Rediriger vers les résultats
      router.push(`/results?candidateId=${candidateId}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Une erreur est survenue lors de la soumission du test');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !testData || allQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
  if (!currentQuestion) return null;

  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const questionKey = `${currentQuestion.sectionId}-${currentQuestion.originalIndex}`;
  const currentAnswer = answers[questionKey] || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span className="text-blue-900 font-bold text-xl">A</span>
              </div>
              <div>
                <div className="font-bold text-lg text-white">Adaepro</div>
                <div className="text-xs text-blue-100">Évaluation en cours</div>
              </div>
            </div>
            <div className="text-sm text-blue-50 font-medium">
              Question {currentQuestionIndex + 1} / {totalQuestions}
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-blue-800" />
        </div>

        {/* Question Card */}
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <div className="mb-8">
              <p className="text-2xl font-medium text-gray-800 leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            {/* Scale */}
            <RadioGroup
              value={currentAnswer.toString()}
              onValueChange={(value) => !isAutoAdvancing && handleAnswer(parseInt(value))}
              disabled={isAutoAdvancing}
            >
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    className={`flex items-center space-x-3 p-5 rounded-lg border-2 cursor-pointer transition-all ${
                      currentAnswer === value
                        ? 'border-orange-500 bg-orange-50 scale-105'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                    } ${isAutoAdvancing ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => !isAutoAdvancing && handleAnswer(value)}
                  >
                    <RadioGroupItem 
                      value={value.toString()} 
                      id={`answer-${value}`}
                      disabled={isAutoAdvancing}
                    />
                    <Label htmlFor={`answer-${value}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{value}</span>
                        <span className="text-base text-gray-700">
                          {testData.scale.labels[value.toString()]}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isAutoAdvancing}
                variant="outline"
                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 border-gray-300"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
            </div>

            {(isSaving || isAutoAdvancing) && (
              <div className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isAutoAdvancing ? 'Passage à la question suivante...' : 'Sauvegarde en cours...'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Info */}
        <div className="mt-4 text-center text-sm text-blue-100">
          {answeredCount} question{answeredCount > 1 ? 's' : ''} répondue{answeredCount > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}
