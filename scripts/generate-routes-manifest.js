
const fs = require('fs');
const path = require('path');

// Chemins
const nextDir = path.join(process.cwd(), '.next');
const manifestPath = path.join(nextDir, 'routes-manifest.json');

// Structure minimale du routes-manifest.json pour Next.js 14.2+
const routesManifest = {
  version: 3,
  pages404: true,
  basePath: '',
  redirects: [],
  rewrites: [],
  headers: [],
  dynamicRoutes: [
    {
      page: '/results/[id]',
      regex: '^/results/([^/]+?)(?:/)?$',
      routeKeys: {
        id: 'id'
      },
      namedRegex: '^/results/(?<id>[^/]+?)(?:/)?$'
    }
  ],
  staticRoutes: [
    {
      page: '/',
      regex: '^/$'
    },
    {
      page: '/identification',
      regex: '^/identification(?:/)?$'
    },
    {
      page: '/payment',
      regex: '^/payment(?:/)?$'
    },
    {
      page: '/results',
      regex: '^/results(?:/)?$'
    },
    {
      page: '/test',
      regex: '^/test(?:/)?$'
    }
  ],
  dataRoutes: [],
  i18n: undefined
};

// Vérifier si le dossier .next existe
if (!fs.existsSync(nextDir)) {
  console.error('❌ Le dossier .next n\'existe pas. Exécutez "yarn build" d\'abord.');
  process.exit(1);
}

// Créer le fichier routes-manifest.json dans plusieurs emplacements
try {
  const manifestContent = JSON.stringify(routesManifest, null, 2);
  
  // 1. Emplacement normal
  fs.writeFileSync(manifestPath, manifestContent);
  console.log('✅ routes-manifest.json créé dans .next/');
  
  // Sur Vercel, créer dans plusieurs emplacements pour gérer outputFileTracingRoot
  if (process.env.VERCEL) {
    const locations = [
      path.join(process.cwd(), '../.next'),
      path.join(process.cwd(), '../../.next'),
      path.join(process.cwd(), '../path0/.next'),
    ];
    
    locations.forEach((location, index) => {
      try {
        if (!fs.existsSync(location)) {
          fs.mkdirSync(location, { recursive: true });
        }
        const manifestPath = path.join(location, 'routes-manifest.json');
        fs.writeFileSync(manifestPath, manifestContent);
        console.log(`✅ Copié dans ${location.replace(process.cwd(), '.')}/`);
      } catch (err) {
        // Ignorer les erreurs de permission silencieusement
      }
    });
  }
} catch (error) {
  console.error('❌ Erreur lors de la création de routes-manifest.json:', error);
  process.exit(1);
}
