
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Évaluation des Compétences Managériales | Adaepro',
  description: 'Évaluez vos compétences managériales de manière approfondie et obtenez un rapport détaillé.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
