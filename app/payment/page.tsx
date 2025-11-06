
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import Image from 'next/image';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams?.get('candidateId');
  const [isLoading, setIsLoading] = useState<string>('');
  const [candidate, setCandidate] = useState<any>(null);

  useEffect(() => {
    if (!candidateId) {
      router.push('/identification');
      return;
    }

    // Récupérer les informations du candidat
    fetch(`/api/candidate?id=${candidateId}`)
      .then(res => res.json())
      .then(data => setCandidate(data))
      .catch(err => console.error(err));
  }, [candidateId, router]);

  const handlePayment = async (provider: string) => {
    setIsLoading(provider);

    // MODE TEST : Paiement désactivé temporairement
    // Redirection directe vers le test après 1 seconde
    setTimeout(() => {
      router.push(`/test?candidateId=${candidateId}`);
    }, 1000);

    /* ANCIEN CODE - À RÉACTIVER PLUS TARD
    try {
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          provider,
          amount: 49,
          currency: 'EUR',
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Rediriger vers la page de paiement
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
        setIsLoading('');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Une erreur est survenue lors de la création de la session de paiement');
      setIsLoading('');
    }
    */
  };

  if (!candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <header className="container mx-auto mb-8 flex justify-center">
        <Image 
          src="/logo.png" 
          alt="Adaepro Logo" 
          width={240} 
          height={91}
          priority
          className="h-auto"
        />
      </header>

      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">
              Finaliser votre inscription
            </CardTitle>
            <CardDescription>
              Bonjour {candidate.firstName} {candidate.lastName}, choisissez votre mode de paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Récapitulatif */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-900">
                Récapitulatif de votre commande
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Évaluation Compétences Managériales</span>
                  <span className="font-semibold">49,00 €</span>
                </div>
                <div className="text-sm text-gray-600">
                  Comprend :
                  <ul className="list-disc list-inside ml-2 mt-1">
                    <li>Test complet (81 questions)</li>
                    <li>Graphiques radar par section</li>
                    <li>Scores détaillés en pourcentage</li>
                    <li>Rapport narratif personnalisé</li>
                    <li>Export PDF professionnel</li>
                  </ul>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">49,00 €</span>
                </div>
              </div>
            </div>

            {/* Options de paiement */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                Choisissez votre mode de paiement
              </h3>

              {/* Stripe */}
              <Button
                onClick={() => handlePayment('stripe')}
                disabled={!!isLoading}
                className="w-full h-16 text-lg justify-between bg-white hover:bg-gray-50 text-gray-900 border-2"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6" />
                  <span>Carte bancaire (Stripe)</span>
                </div>
                {isLoading === 'stripe' && <Loader2 className="w-5 h-5 animate-spin" />}
              </Button>

              {/* PayPal */}
              <Button
                onClick={() => handlePayment('paypal')}
                disabled={!!isLoading}
                className="w-full h-16 text-lg justify-between bg-white hover:bg-gray-50 text-gray-900 border-2"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 .901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506c-.39 0-.688-.307-.611-.707l2.118-13.42c.072-.458.49-.814.952-.814h7.52c1.872 0 3.268.329 4.246 1.021z"/>
                  </svg>
                  <span>PayPal</span>
                </div>
                {isLoading === 'paypal' && <Loader2 className="w-5 h-5 animate-spin" />}
              </Button>

              {/* Weeroo */}
              <Button
                onClick={() => handlePayment('weeroo')}
                disabled={!!isLoading}
                className="w-full h-16 text-lg justify-between bg-white hover:bg-gray-50 text-gray-900 border-2"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6" />
                  <span>Weeroo</span>
                </div>
                {isLoading === 'weeroo' && <Loader2 className="w-5 h-5 animate-spin" />}
              </Button>
            </div>

            <div className="text-sm text-gray-500 text-center">
              Paiement 100% sécurisé • Garantie satisfait ou remboursé
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
