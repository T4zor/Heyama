'use client';

import { ObjectItem, deleteObject } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ObjectCardProps {
  object: ObjectItem;
  onDeleted?: (id: string) => void;
  isAdmin?: boolean;
}

export default function ObjectCard({ object, onDeleted, isAdmin = false }: ObjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteObject(object._id);
      toast.success('Objet supprimé');
      setDialogOpen(false);
      onDeleted?.(object._id);
    } catch {
      toast.error('Échec de la suppression');
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={object.imageUrl}
          alt={object.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg truncate">{object.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {object.description}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(object.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <div className="flex gap-2 pt-2">
          <Link href={`/objects/${object._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Voir
            </Button>
          </Link>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={<Button variant="destructive" size="sm">Supprimer</Button>}>
                {null}
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Êtes-vous sûr ?</DialogTitle>
                  <DialogDescription>
                    Cette action est irréversible. Voulez-vous vraiment supprimer cet objet de la galerie ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isDeleting}>
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Suppression...' : 'Oui, supprimer'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
