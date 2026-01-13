'use client';

import { useDiscoveryStore, type DiscoverySummary as SummaryType } from '@/store/discoveryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon, EditIcon, Loader2Icon } from 'lucide-react';

interface DiscoverySummaryProps {
  summary: SummaryType;
  onConfirm: () => void;
  onEdit: () => void;
  isGenerating?: boolean;
}

export function DiscoverySummary({
  summary,
  onConfirm,
  onEdit,
  isGenerating,
}: DiscoverySummaryProps) {
  const qaHistory = useDiscoveryStore((s) => s.qaHistory);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{summary.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Summary</h4>
            <p className="text-sm text-muted-foreground">{summary.summary}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Key Components</h4>
            <div className="flex flex-wrap gap-2">
              {summary.components.map((component, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                >
                  {component}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Data Flow</h4>
            <p className="text-sm text-muted-foreground">{summary.dataFlow}</p>
          </div>
        </CardContent>
      </Card>

      {/* Q&A History */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Your Answers</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {qaHistory.map((qa, i) => (
            <div key={i} className="text-xs">
              <span className="text-muted-foreground">Q{i + 1}: </span>
              <span className="text-foreground">{qa.answer}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={onEdit}
          disabled={isGenerating}
          className="flex-1"
        >
          <EditIcon className="w-4 h-4 mr-2" />
          Edit Answers
        </Button>
        <Button onClick={onConfirm} disabled={isGenerating} className="flex-1">
          {isGenerating ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Generate Diagram
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
