
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

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
    const currentQuestion = allQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    const questionKey = `${currentQuestion.sectionId}-${currentQuestion.originalIndex}`;
    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);

    // Auto-avancer après 600ms
    setTimeout(async () => {
      await saveProgress();
      
      if (currentQuestionIndex < allQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Terminer le test
        await handleSubmit(newAnswers);
      }
    }, 600);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#2c2c2c] mx-auto" />
          <p className="mt-4 text-gray-700 font-medium">Chargement...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg px-8 py-4 shadow-lg">
            <Image 
              src="/logo.png" 
              alt="Adaepro Logo" 
              width={220} 
              height={83}
              className="h-auto"
            />
          </div>
        </div>
        
        {/* Progress Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-[#2c2c2c]">
              Questionnaire
            </h1>
            <span className="text-sm text-gray-600 font-medium">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-[#2c2c2c] h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-right">
            Progression : {Math.round(progressPercentage)}%
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-[#2c2c2c]">
          <h2 className="text-xl font-bold text-[#2c2c2c] mb-6">
            {currentQuestion.text}
          </h2>
          
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((value) => {
              const isSelected = currentAnswer === value;
              
              return (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3 hover:bg-gray-50 ${
                    isSelected
                      ? 'border-[#2c2c2c] bg-gray-100'
                      : 'border-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-[#2c2c2c] bg-[#2c2c2c]'
                        : 'border-gray-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-medium text-gray-700 flex-1 flex items-center justify-between">
                    <span className="font-semibold">{value}</span>
                    <span>{testData.scale.labels[value.toString()]}</span>
                  </span>
                </button>
              );
            })}
          </div>
          
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="mt-6 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200"
            >
              ← Précédent
            </button>
          )}

          {isSaving && (
            <div className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Sauvegarde en cours...
            </div>
          )}
        </div>

        {/* Progress Info */}
        <div className="mt-4 text-center text-sm text-gray-300">
          {answeredCount} question{answeredCount > 1 ? 's' : ''} répondue{answeredCount > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}
