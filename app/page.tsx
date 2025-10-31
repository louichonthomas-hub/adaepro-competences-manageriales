
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, TrendingUp, BarChart3, FileText, Award, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Logo Bar - Separate */}
          <div className="bg-white rounded-2xl shadow-lg py-3 px-4 flex justify-center items-center mb-12">
            <div className="relative w-64 h-24">
              <Image
                src="/logo.png"
                alt="Adaepro Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Main Title Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                Évaluez vos compétences managériales
              </h1>
              <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
                Une évaluation complète et approfondie de vos compétences de manager.
              </p>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Obtenez un rapport détaillé avec graphiques, scores et recommandations personnalisées.
              </p>
              <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700 font-medium">9 dimensions évaluées</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700 font-medium">Rapport PDF détaillé</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700 font-medium">Prix : 49€</span>
                </div>
              </div>
              <div className="inline-flex flex-col items-center gap-4">
                <Link
                  href="/identification"
                  className="px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Commencer l'évaluation
                </Link>
                <p className="text-sm text-gray-600">Paiement sécurisé • Accès immédiat après paiement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
              Ce que vous obtenez
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <BarChart3 className="w-12 h-12 mb-4 text-orange-500" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Graphiques Radar
                </h3>
                <p className="text-gray-700">
                  Visualisez vos compétences par dimension avec des graphiques radar détaillés.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <TrendingUp className="w-12 h-12 mb-4 text-orange-500" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Scores en Pourcentage
                </h3>
                <p className="text-gray-700">
                  Obtenez des scores précis en pourcentage pour chaque dimension et identifiez vos forces.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <FileText className="w-12 h-12 mb-4 text-orange-500" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Rapport
                </h3>
                <p className="text-gray-700">
                  Recevez un rapport complet avec des recommandations personnalisées.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections Evaluated */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
              Les 9 dimensions évaluées
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Leadership et Vision',
                'Communication et Relations Interpersonnelles',
                'Gestion des Performances et Développement des Talents',
                'Gestion du Changement et Innovation',
                'Prise de Décision et Résolution de Problème',
                'Gestion du Temps et des Priorités',
                'Compétences Techniques et Opérationnelles',
                'Engagement et Esprit d\'Équipe',
                'Intelligence Émotionnelle'
              ].map((section, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{section}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
              Pourquoi passer cette évaluation ?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <Award className="w-12 h-12 flex-shrink-0 text-orange-500" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Identifiez vos forces et axes d'amélioration
                  </h3>
                  <p className="text-gray-700">
                    Obtenez une vision claire de vos compétences managériales actuelles.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <Users className="w-12 h-12 flex-shrink-0 text-orange-500" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Développez votre leadership
                  </h3>
                  <p className="text-gray-700">
                    Recevez des recommandations concrètes pour améliorer votre efficacité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 mb-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Prêt à progresser ?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Investissez dans votre développement professionnel dès aujourd'hui
            </p>
            <Link
              href="/identification"
              className="inline-block px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 py-8 px-4 bg-white">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          <p>&copy; 2025 Adaepro. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
