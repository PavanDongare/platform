'use client';

import { BarChart3, Database, Loader2, ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useObjectTypes } from '../lib/hooks';
import { useRelationships } from '../lib/hooks/use-relationships';
import { useActionTypes } from '../lib/hooks/use-actions';

export default function DashboardPage() {
  const { objectTypes, loading: typesLoading } = useObjectTypes();
  const { relationships, loading: relsLoading } = useRelationships();
  const { actionTypes, loading: actionsLoading } = useActionTypes();

  const loading = typesLoading || relsLoading || actionsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Object Types',
      value: objectTypes.length,
      icon: Database,
      description: 'Schema definitions',
    },
    {
      title: 'Relationships',
      value: relationships.length,
      icon: ArrowRight,
      description: 'Type connections',
    },
    {
      title: 'Actions',
      value: actionTypes.length,
      icon: Zap,
      description: 'Automated workflows',
    },
  ];

  // Count total properties
  const totalProperties = objectTypes.reduce(
    (sum, type) => sum + Object.keys(type.config.properties || {}).length,
    0
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your ontology
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Schema Complexity</CardTitle>
            <CardDescription>Properties across all types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProperties}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Total properties defined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Ontology overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Junction Types</span>
              <span className="font-medium">
                {objectTypes.filter(t => t.config.isJunction).length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Regular Types</span>
              <span className="font-medium">
                {objectTypes.filter(t => !t.config.isJunction).length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">M:N Relationships</span>
              <span className="font-medium">
                {relationships.filter(r => r.cardinality === 'MANY_TO_MANY').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
