'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function IdentificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errorFirstName, setErrorFirstName] = useState('');
  const [errorLastName, setErrorLastName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [candidateData, setCandidateData] = useState<{ candidateId: string; candidate: any } | null>(null);

  const validateEmail = (emailValue: string) => {
    // Validation plus permissive pour accepter tous les formats standards
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(emailValue.toLowerCase());
  };

  const handleContinueTest = () => {
    if (candidateData) {
      router.push(`/payment?candidateId=${candidateData.candidateId}`);
    }
  };

  const handleRestartTest = async () => {
    if (!candidateData) return;
    
    setLoading(true);
    try {
      await fetch(`/api/test-progress?candidateId=${candidateData.candidateId}`, {
        method: 'DELETE',
      });
      
      router.push(`/payment?candidateId=${candidateData.candidateId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorLastName('');
    setErrorFirstName('');
    setErrorEmail('');
    
    let hasError = false;
    
    if (!lastName.trim()) {
      setErrorLastName('Le nom est requis');
      hasError = true;
    }
    if (!firstName.trim()) {
      setErrorFirstName('Le prénom est requis');
      hasError = true;
    }
    if (!email.trim()) {
      setErrorEmail('L\'email est requis');
      hasError = true;
    } else if (!validateEmail(email)) {
      setErrorEmail('Email invalide');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création du candidat');
      }
      
      const data = await response.json();
      
      if (data.hasProgress) {
        setCandidateData(data);
        setShowResumeDialog(true);
        setLoading(false);
      } else {
        router.push(`/payment?candidateId=${data.candidateId}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.png" 
              alt="Adaepro Logo" 
              width={280} 
              height={106}
              priority
              className="h-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Compétences Managériales
          </h1>
          <p className="text-gray-600 text-sm">
            Évaluez vos compétences managériales
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Durée estimée : 15-20 minutes • 9 dimensions évaluées
          </p>
        </div>
        
        {showResumeDialog && candidateData ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    Test en cours détecté
                  </h3>
                  <p className="text-sm text-blue-700">
                    Bonjour <span className="font-semibold">{candidateData.candidate.firstName} {candidateData.candidate.lastName}</span>,
                    nous avons détecté que vous avez déjà commencé ce test. Souhaitez-vous reprendre où vous vous êtes arrêté ou recommencer ?
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleContinueTest}
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continuer le test
              </button>
              
              <button
                onClick={handleRestartTest}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-lg border-2 border-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Chargement...' : 'Recommencer le test'}
              </button>

              <button
                onClick={() => {
                  setShowResumeDialog(false);
                  setCandidateData(null);
                }}
                className="w-full text-gray-600 hover:text-gray-800 text-sm py-2"
              >
                Retour
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-1">
                Nom *
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition"
                placeholder="Votre nom"
                disabled={loading}
              />
              {errorLastName && (
                <p className="text-red-600 text-xs mt-1">{errorLastName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-1">
                Prénom *
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition"
                placeholder="Votre prénom"
                disabled={loading}
              />
              {errorFirstName && (
                <p className="text-red-600 text-xs mt-1">{errorFirstName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1">
                Email *
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition"
                placeholder="votre.email@exemple.com"
                disabled={loading}
                autoComplete="email"
              />
              {errorEmail && (
                <p className="text-red-600 text-xs mt-1">{errorEmail}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? 'Chargement...' : 'Commencer le test'}
            </button>
          </form>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Vos données sont confidentielles et utilisées uniquement pour générer vos résultats.
          </p>
        </div>
      </div>
    </div>
  );
}