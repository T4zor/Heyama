'use client';

import { ObjectItem, deleteObject } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

interface ObjectCardProps {
  object: ObjectItem;
  onDeleted?: (id: string) => void;
}

export default function ObjectCard({ object, onDeleted }: ObjectCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await deleteObject(object._id);
      toast.success('Objet supprimé');
      onDeleted?.(object._id);
    } catch {
      toast.error('Échec de la suppression');
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
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
