'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function IdentificationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    department: '',
    position: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Créer ou récupérer le candidat
      const response = await fetch('/api/candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du profil');
      }

      const data = await response.json();

      // Si le candidat a déjà payé, aller directement au test
      if (data.hasPaid) {
        router.push(`/test?candidateId=${data.id}`);
      } else {
        // Sinon, aller à la page de paiement
        router.push(`/payment?candidateId=${data.id}`);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const dimensions = [
    { icon: '🎯', name: 'Pilotage' },
    { icon: '👥', name: 'Animation' },
    { icon: '💡', name: 'Innovation' },
    { icon: '🤝', name: 'Collaboration' },
    { icon: '🌟', name: 'Leadership' },
    { icon: '📊', name: 'Analyse' },
    { icon: '🗣️', name: 'Communication' },
    { icon: '⚡', name: 'Décision' },
    { icon: '🎓', name: 'Développement' },
  ];

  const benefits = [
    {
      icon: '✓',
      title: 'Diagnostic Complet',
      description: 'Obtenez une vision claire de vos compétences managériales actuelles',
    },
    {
      icon: '✓',
      title: 'Axes de Progrès',
      description: 'Identifiez précisément vos points forts et vos opportunités d\'amélioration',
    },
    {
      icon: '✓',
      title: 'Plan d\'Action',
      description: 'Recevez des recommandations personnalisées pour votre développement',
    },
    {
      icon: '✓',
      title: 'Résultats Détaillés',
      description: 'Accédez à un rapport complet avec visualisations et analyses approfondies',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
      {/* Header */}
      <header className="container mx-auto mb-16">
        <div className="flex items-center gap-5 pb-6 border-b-2" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
          <div className="relative w-16 h-16">
            <Image
              src="/logo.png"
              alt="Adaepro"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold" style={{ color: '#d4af37' }}>Adaepro</div>
            <div className="text-base" style={{ color: '#a0a0a0' }}>Test de Compétences Managériales</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 
            className="text-5xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f4e5b4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Évaluation des Compétences Managériales
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#b0b0b0' }}>
            Découvrez vos forces et vos axes de progression à travers une évaluation complète de 9 dimensions clés du management.
          </p>
        </section>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Les 9 Dimensions Évaluées */}
          <Card className="border-2 bg-opacity-5 backdrop-blur-lg transition-all hover:scale-105" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: '#d4af37' }}>
                <span className="text-4xl">🎯</span>
                Les 9 Dimensions Évaluées
              </h2>
              <div className="grid grid-cols-3 gap-5">
                {dimensions.map((dim, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl text-center transition-all hover:scale-110"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    <div className="text-4xl mb-2">{dim.icon}</div>
                    <div className="text-sm font-semibold text-white">{dim.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pourquoi Passer Cette Évaluation */}
          <Card className="border-2 bg-opacity-5 backdrop-blur-lg transition-all hover:scale-105" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: '#d4af37' }}>
                <span className="text-4xl">💡</span>
                Pourquoi passer cette évaluation ?
              </h2>
              <ul className="space-y-5">
                {benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-lg transition-all"
                    style={{ background: 'rgba(212, 175, 55, 0.05)' }}
                  >
                    <span className="text-2xl font-bold flex-shrink-0" style={{ color: '#d4af37' }}>
                      {benefit.icon}
                    </span>
                    <div className="flex-1">
                      <div className="text-base font-semibold mb-1" style={{ color: '#d4af37' }}>
                        {benefit.title}
                      </div>
                      <div className="text-sm" style={{ color: '#b0b0b0' }}>
                        {benefit.description}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire - Prêt à Progresser */}
        <Card className="border-2 bg-opacity-5 backdrop-blur-lg max-w-5xl mx-auto" 
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
          <CardContent className="p-10">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: '#d4af37' }}>
              <span className="text-4xl">📝</span>
              Prêt à progresser ?
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold" style={{ color: '#d4af37' }}>
                    Prénom *
                  </Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="p-4 text-base border-2 rounded-lg transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      color: '#ffffff',
                    }}
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold" style={{ color: '#d4af37' }}>
                    Nom *
                  </Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="p-4 text-base border-2 rounded-lg transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      color: '#ffffff',
                    }}
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold" style={{ color: '#d4af37' }}>
                  Email professionnel *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="p-4 text-base border-2 rounded-lg transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    color: '#ffffff',
                  }}
                  placeholder="jean.dupont@entreprise.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-semibold" style={{ color: '#d4af37' }}>
                  Entreprise
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="p-4 text-base border-2 rounded-lg transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    color: '#ffffff',
                  }}
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold" style={{ color: '#d4af37' }}>
                    Département
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="p-4 text-base border-2 rounded-lg transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      color: '#ffffff',
                    }}
                    placeholder="Direction, Service..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-semibold" style={{ color: '#d4af37' }}>
                    Fonction
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="p-4 text-base border-2 rounded-lg transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      color: '#ffffff',
                    }}
                    placeholder="Votre fonction actuelle"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg text-sm" style={{ background: 'rgba(227, 6, 19, 0.1)', border: '1px solid rgba(227, 6, 19, 0.3)', color: '#ff6b6b' }}>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full p-5 text-lg font-bold rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4e5b4 100%)',
                  color: '#1a1a1a',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Commencer l\'évaluation'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center pt-12 mt-16 border-t-2" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', color: '#808080' }}>
          <p>&copy; 2025 Adaepro. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
}
