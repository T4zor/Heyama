'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getObject, deleteObject, ObjectItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ObjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [object, setObject] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const data = await getObject(params.id as string);
        setObject(data);
      } catch {
        setError('Objet introuvable');
      } finally {
        setLoading(false);
      }
    };
    fetchObject();
  }, [params.id]);

  const handleDelete = async () => {
    if (!object) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) return;

    try {
      await deleteObject(object._id);
      toast.success('Objet supprimé');
      router.push('/');
    } catch {
      toast.error('Échec de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-semibold mb-2">{error || 'Objet introuvable'}</h2>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              ← Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">← Retour</Button>
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Heyama</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <Dialog>
            <DialogTrigger render={
              <div className="relative cursor-pointer group">
                <img
                  src={object.imageUrl}
                  alt={object.title}
                  className="w-full h-64 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span className="text-lg font-medium">🔍 Voir en plein écran</span>
                </div>
              </div>
            }>
              {null}
            </DialogTrigger>
            <DialogContent className="!max-w-none !w-screen !h-screen !p-0 !m-0 !rounded-none bg-black/95 border-none shadow-none flex items-center justify-center overflow-hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>Image {object.title}</DialogTitle>
              </DialogHeader>
              <div 
                className={`overflow-auto flex items-center justify-center w-full h-full cursor-zoom-${isZoomed ? 'out' : 'in'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={object.imageUrl}
                  alt={object.title}
                  className={`transition-transform duration-300 origin-center ${isZoomed ? 'scale-[2.5] cursor-zoom-out' : 'max-h-screen max-w-screen object-contain cursor-zoom-in'}`}
                />
              </div>
            </DialogContent>
          </Dialog>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-3xl font-bold">{object.title}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {object.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Créé le{' '}
                {new Date(object.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <Button variant="destructive" onClick={handleDelete}>
                Supprimer l'objet
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
