'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Settings, Database, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useObjectTypes } from '../lib/hooks';

export default function OntologyPage() {
  const { objectTypes, loading, error, refetch } = useObjectTypes();

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
        <Button onClick={refetch} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Object Types</h1>
          <p className="text-muted-foreground">
            Define and manage your data schema
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/metaflow/ontology/relationships">
            <Button variant="outline">
              <ArrowRight className="w-4 h-4 mr-2" />
              Relationships
            </Button>
          </Link>
          <Link href="/metaflow/ontology/visualization">
            <Button variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Visualization
            </Button>
          </Link>
          <Link href="/metaflow/ontology/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Object Type
            </Button>
          </Link>
        </div>
      </div>

      {/* Object Types Grid */}
      {objectTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Object Types</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first object type
            </p>
            <Link href="/metaflow/ontology/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Object Type
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {objectTypes.map((type) => {
            const propertyCount = Object.keys(type.config.properties || {}).length;
            return (
              <Card key={type.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{type.displayName}</CardTitle>
                      <CardDescription>
                        {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
                      </CardDescription>
                    </div>
                    <Link href={`/metaflow/ontology/${type.id}`}>
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/metaflow/ontology/${type.id}/data`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Data
                      </Button>
                    </Link>
                    <Link href={`/metaflow/workspace/${type.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Workspace
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
