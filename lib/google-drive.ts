
import { google } from 'googleapis';
import { Readable } from 'stream';

// Lire le token OAuth depuis la variable d'environnement
function getAccessToken(): string | null {
  try {
    // Utiliser la variable d'environnement
    if (process.env.GOOGLE_DRIVE_ACCESS_TOKEN) {
      return process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
    }

    console.error('Token d\'accès Google Drive non trouvé dans les variables d\'environnement');
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
}

// Configuration OAuth2 pour Google Drive
export function getGoogleAuth() {
  const oauth2Client = new google.auth.OAuth2();
  
  // Utiliser le token d'accès depuis la variable d'environnement
  const accessToken = getAccessToken();
  
  if (accessToken) {
    oauth2Client.setCredentials({
      access_token: accessToken
    });
  } else {
    throw new Error('Token d\'accès Google Drive non disponible. Veuillez configurer GOOGLE_DRIVE_ACCESS_TOKEN.');
  }

  return oauth2Client;
}

// Créer un dossier dans Google Drive
export async function createFolder(folderName: string, parentFolderId?: string) {
  try {
    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId];
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name'
    });

    return response.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

// Uploader un fichier vers Google Drive
export async function uploadFile(
  buffer: Buffer, 
  fileName: string, 
  mimeType: string,
  folderId?: string
) {
  try {
    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata: any = {
      name: fileName
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const media = {
      mimeType: mimeType,
      body: Readable.from(buffer)
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink'
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Trouver un dossier par nom
export async function findFolderByName(folderName: string, parentFolderId?: string) {
  try {
    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    let query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    
    if (parentFolderId) {
      query += ` and '${parentFolderId}' in parents`;
    }

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0];
    }

    return null;
  } catch (error) {
    console.error('Error finding folder:', error);
    throw error;
  }
}

// Créer ou obtenir un dossier
export async function getOrCreateFolder(folderName: string, parentFolderId?: string) {
  const existingFolder = await findFolderByName(folderName, parentFolderId);
  
  if (existingFolder) {
    return existingFolder;
  }

  return await createFolder(folderName, parentFolderId);
}
