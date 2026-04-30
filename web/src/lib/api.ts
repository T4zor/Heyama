// URL de base de notre API NestJS (en local ou sur Render)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

// Structure de données (Interface TypeScript) pour un Objet
export interface ObjectItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  createdAt: string;
  updatedAt: string;
}

// Fonction pour récupérer TOUS les objets
export async function getObjects(): Promise<ObjectItem[]> {
  // On utilise 'no-store' pour forcer Next.js à toujours demander les données fraîches au serveur
  const res = await fetch(`${API_URL}/objects`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch objects');
  return res.json();
}

export async function getObject(id: string): Promise<ObjectItem> {
  const res = await fetch(`${API_URL}/objects/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch object');
  return res.json();
}

export async function createObject(formData: FormData): Promise<ObjectItem> {
  const res = await fetch(`${API_URL}/objects`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create object');
  }
  return res.json();
}

export async function deleteObject(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/objects/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete object');
}

export function getApiUrl(): string {
  return API_URL;
}
