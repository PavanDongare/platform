'use client';

import { GitBranch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProcessesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Processes</h1>
        <p className="text-muted-foreground">
          Design and manage workflows
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <GitBranch className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Process Designer</h3>
          <p className="text-muted-foreground text-center">
            Coming soon - visual workflow designer with state management
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
