'use client';

import Link from 'next/link';
import { Loader2, Zap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useActionTypes } from '../lib/hooks';

export default function ActionsPage() {
  const { actionTypes, loading, error } = useActionTypes();

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Actions</h1>
          <p className="text-muted-foreground">
            {actionTypes.length} action{actionTypes.length !== 1 ? 's' : ''} defined
          </p>
        </div>
        <Link href="/metaflow/actions/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Action
          </Button>
        </Link>
      </div>

      {actionTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Actions</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first action to automate workflows
            </p>
            <Link href="/metaflow/actions/new">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Action
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionTypes.map((action) => (
            <Link key={action.id} href={`/metaflow/actions/${action.id}`}>
              <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader>
                  <CardTitle>{action.displayName}</CardTitle>
                  <CardDescription>
                    {action.config.executionType === 'declarative' ? 'Declarative' : 'Function-backed'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {action.config.parameters?.length || 0} parameter{(action.config.parameters?.length || 0) !== 1 ? 's' : ''}
                  </p>
                  {action.config.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {action.config.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
