'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Workflow, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProcessLayouts } from '../lib/hooks/use-process';
import { useObjectTypes } from '../lib/hooks/use-ontology';

export default function ProcessesPage() {
  const router = useRouter();
  const { layouts, loading, createLayout, deleteLayout } = useProcessLayouts();
  const { objectTypes } = useObjectTypes();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProcessName, setNewProcessName] = useState('');
  const [selectedObjectTypeId, setSelectedObjectTypeId] = useState<string>('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newProcessName.trim() || !selectedObjectTypeId) return;

    try {
      setCreating(true);
      const layout = await createLayout(newProcessName, [selectedObjectTypeId]);
      setShowCreateDialog(false);
      setNewProcessName('');
      setSelectedObjectTypeId('');
      router.push(`/metaflow/processes/${layout.id}`);
    } catch (error) {
      console.error('Failed to create process:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, processName: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this process?')) return;

    try {
      await deleteLayout(processName);
    } catch (error) {
      console.error('Failed to delete process:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Processes</h1>
          <p className="text-muted-foreground">
            Visual state machine canvases for your workflows
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Process
        </Button>
      </div>

      {/* Process List */}
      {layouts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Workflow className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No processes yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first process canvas to visualize state transitions
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Process
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layouts.map((layout) => (
            <Card
              key={layout.id}
              onClick={() => router.push(`/metaflow/processes/${layout.id}`)}
              className="cursor-pointer hover:border-primary transition-colors group"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {layout.processName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {layout.objectTypeIds.length} object type
                      {layout.objectTypeIds.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Updated {new Date(layout.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(e, layout.processName)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Process</DialogTitle>
            <DialogDescription>
              Start by choosing a name and initial object type for your process
              canvas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="process-name">Process Name</Label>
              <Input
                id="process-name"
                placeholder="e.g., Order Fulfillment"
                value={newProcessName}
                onChange={(e) => setNewProcessName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="object-type">Initial Object Type</Label>
              <Select
                value={selectedObjectTypeId}
                onValueChange={setSelectedObjectTypeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an object type" />
                </SelectTrigger>
                <SelectContent>
                  {objectTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose an object type with state properties (string + picklist)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newProcessName.trim() || !selectedObjectTypeId || creating}
            >
              {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
