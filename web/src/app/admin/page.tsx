'use client';

import { useState, useEffect, useCallback } from 'react';
import { getObjects, ObjectItem } from '@/lib/api';
import { useSocket } from '@/lib/socket';
import CreateObjectForm from '@/components/CreateObjectForm';
import ObjectCard from '@/components/ObjectCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Toaster } from 'sonner';
import Link from 'next/link';

export default function AdminPage() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchObjects = useCallback(async () => {
    try {
      const data = await getObjects();
      setObjects(data);
    } catch (err) {
      console.error('Failed to fetch objects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);

  // Real-time updates via Socket.IO
  useSocket(
    // On object created
    (newObj: ObjectItem) => {
      setObjects((prev) => [newObj, ...prev]);
    },
    // On object deleted
    ({ id }: { id: string }) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    },
  );

  const handleDeleted = (id: string) => {
    setObjects((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center flex-wrap gap-3">
              Heyama 
              <span className="relative flex h-3 w-3" title="Mode Admin">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestionnaire complet d'objets
            </p>
          </div>
          <div className="flex gap-4 items-center w-full sm:w-auto">
            <Link href="/">
              <Button variant="ghost" className="hidden sm:inline-flex">Retour Client</Button>
              <Button variant="ghost" size="icon" className="sm:hidden" title="Retour Client">
                ←
              </Button>
            </Link>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={<Button size="lg" />}>
                + Nouvel objet
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel objet</DialogTitle>
                </DialogHeader>
                <CreateObjectForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : objects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold mb-2">Aucun objet pour le moment</h2>
            <p className="text-muted-foreground mb-6">
              Créez votre premier objet pour commencer
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={<Button size="lg" />}>
                + Créer votre premier objet
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel objet</DialogTitle>
                </DialogHeader>
                <CreateObjectForm />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {objects.length} Objet{objects.length > 1 ? 's' : ''}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {objects.map((obj) => (
                <ObjectCard
                  key={obj._id}
                  object={obj}
                  onDeleted={handleDeleted}
                  isAdmin={true}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
