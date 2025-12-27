'use client';

import { Loader2, Zap } from 'lucide-react';
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
      <div>
        <h1 className="text-2xl font-bold">Actions</h1>
        <p className="text-muted-foreground">
          Define and manage declarative actions
        </p>
      </div>

      {actionTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Actions</h3>
            <p className="text-muted-foreground text-center">
              Actions can be created to automate workflows
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionTypes.map((action) => (
            <Card key={action.id}>
              <CardHeader>
                <CardTitle>{action.displayName}</CardTitle>
                <CardDescription>
                  {action.config.executionType} action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {action.config.parameters?.length || 0} parameters
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
