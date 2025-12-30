'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { useObjectProcessState } from '../../lib/hooks/use-process';
import { useObjectType } from '../../lib/hooks/use-ontology';

interface StatusBreadcrumbProps {
  objectTypeId: string;
  objectData: Record<string, unknown>;
}

export function StatusBreadcrumb({ objectTypeId, objectData }: StatusBreadcrumbProps) {
  const { process, currentState, stateProperty, loading, error } = useObjectProcessState(
    objectTypeId,
    objectData
  );
  const { objectType } = useObjectType(objectTypeId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-pulse text-sm text-muted-foreground">Loading workflow...</div>
      </div>
    );
  }

  if (error || !process || !stateProperty || !objectType) {
    return null;
  }

  // Get picklist options from object type config
  const statePropertyDef = objectType.config.properties[stateProperty];
  if (!statePropertyDef?.picklistConfig?.options) {
    return null;
  }

  const stages = statePropertyDef.picklistConfig.options;
  const currentIndex = currentState ? stages.indexOf(currentState) : -1;
  const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / stages.length) * 100 : 0;

  return (
    <div className="bg-card border rounded-md">
      <div className="px-6 py-6">
        {/* Header with status */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {process.processName}
              </h3>
              <p className="text-2xl font-semibold mt-1">{currentState || 'Unknown'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-lg font-semibold mt-1">
                {currentIndex + 1} of {stages.length}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Workflow stages */}
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={stage} className="flex items-center flex-1">
                {/* Stage node */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                      ${isCompleted
                        ? 'bg-green-50 dark:bg-green-950 border-green-500 text-green-600'
                        : isCurrent
                        ? 'bg-primary/10 border-primary text-primary ring-4 ring-primary/20'
                        : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                    ) : (
                      <Circle className="w-5 h-5" strokeWidth={2} />
                    )}
                  </div>

                  {/* Stage label */}
                  <span
                    className={`
                      text-xs font-medium mt-2 text-center max-w-20 transition-colors duration-200
                      ${isCurrent
                        ? 'text-foreground'
                        : isCompleted
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/60'
                      }
                    `}
                  >
                    {stage}
                  </span>
                </div>

                {/* Connector (not for last item) */}
                {index < stages.length - 1 && (
                  <div className="flex-1 flex items-center mx-2">
                    <div
                      className={`h-0.5 w-full transition-colors duration-200 ${
                        isCompleted ? 'bg-green-500' : 'bg-muted'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
