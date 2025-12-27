'use client';

import Link from 'next/link';
import { Database, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useObjectTypes } from '../lib/hooks';

export default function WorkspacePage() {
  const { objectTypes, loading, error } = useObjectTypes();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  // Filter out junction object types
  const regularTypes = objectTypes.filter(t => !t.config.isJunction);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workspace</h1>
        <p className="text-muted-foreground">
          Manage your data instances
        </p>
      </div>

      {regularTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Object Types</h3>
            <p className="text-muted-foreground text-center">
              Create object types in the Ontology section first
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularTypes.map((type) => (
            <Link key={type.id} href={`/metaflow/workspace/${type.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{type.displayName}</CardTitle>
                  <CardDescription>
                    {Object.keys(type.config.properties || {}).length} properties
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
