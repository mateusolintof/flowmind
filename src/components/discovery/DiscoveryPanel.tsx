'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDiscoveryStore } from '@/store/discoveryStore';
import { useAI } from '@/hooks/ai/useAI';
import { DiscoveryProgress } from './DiscoveryProgress';
import { QuestionCard } from './QuestionCard';
import { DiscoverySummary } from './DiscoverySummary';
import { Loader2Icon, SparklesIcon, AlertCircleIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

interface DiscoveryPanelProps {
  onDiagramGenerated?: (nodes: unknown[], edges: unknown[]) => void;
}

export function DiscoveryPanel({ onDiagramGenerated }: DiscoveryPanelProps) {
  const isOpen = useDiscoveryStore((s) => s.isOpen);
  const phase = useDiscoveryStore((s) => s.phase);
  const currentQuestion = useDiscoveryStore((s) => s.currentQuestion);
  const qaHistory = useDiscoveryStore((s) => s.qaHistory);
  const summary = useDiscoveryStore((s) => s.summary);
  const error = useDiscoveryStore((s) => s.error);

  const close = useDiscoveryStore((s) => s.close);
  const setPhase = useDiscoveryStore((s) => s.setPhase);
  const setCurrentQuestion = useDiscoveryStore((s) => s.setCurrentQuestion);
  const addQA = useDiscoveryStore((s) => s.addQA);
  const setSummary = useDiscoveryStore((s) => s.setSummary);
  const setError = useDiscoveryStore((s) => s.setError);
  const reset = useDiscoveryStore((s) => s.reset);
  const getConversationText = useDiscoveryStore((s) => s.getConversationText);

  const { isLoading, getInitialQuestion, getFollowUpQuestion, getSummary, generateDiagram } = useAI({
    onError: (err) => setError(err),
  });

  // Ref for auto-scroll
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaHistory, currentQuestion, phase]);

  // Start discovery when opened
  const startDiscovery = useCallback(async () => {
    setPhase('loading');
    setError(null);

    const response = await getInitialQuestion();
    if (response?.content) {
      setCurrentQuestion(response.content);
    }
  }, [getInitialQuestion, setPhase, setCurrentQuestion, setError]);

  // Handle user answer
  const handleAnswer = useCallback(async (answer: string) => {
    // Save Q&A
    addQA(currentQuestion, answer);
    setPhase('loading');

    // Get conversation so far
    const conversation = getConversationText() + `\nQ: ${currentQuestion}\nA: ${answer}`;

    // Get next question
    const response = await getFollowUpQuestion(conversation);

    if (response?.isReady) {
      // AI has enough info, get summary
      setPhase('summarizing');
      const summaryResponse = await getSummary(conversation);

      if (summaryResponse?.content) {
        try {
          const parsedSummary = JSON.parse(summaryResponse.content);
          setSummary(parsedSummary);
          setPhase('summarizing');
        } catch {
          setError('Failed to parse summary. Please try again.');
        }
      }
    } else if (response?.content) {
      setCurrentQuestion(response.content);
    }
  }, [currentQuestion, addQA, getConversationText, getFollowUpQuestion, getSummary, setSummary, setPhase, setError, setCurrentQuestion]);

  // Generate diagram
  const handleGenerateDiagram = useCallback(async () => {
    if (!summary) return;

    setPhase('generating');
    const conversation = getConversationText();
    const summaryText = JSON.stringify(summary);

    const response = await generateDiagram(conversation, summaryText);

    if (response?.content) {
      try {
        const diagram = JSON.parse(response.content);
        if (diagram.nodes && diagram.edges) {
          setPhase('complete');
          onDiagramGenerated?.(diagram.nodes, diagram.edges);
          toast.success('Diagram generated successfully!');
          close();
        } else {
          setError('Invalid diagram structure');
        }
      } catch {
        setError('Failed to parse diagram. Please try again.');
      }
    }
  }, [summary, getConversationText, generateDiagram, setPhase, setError, onDiagramGenerated, close]);

  // Handle edit - go back to questioning
  const handleEdit = useCallback(() => {
    // Reset to last question state
    const lastQA = qaHistory[qaHistory.length - 1];
    if (lastQA) {
      setCurrentQuestion(lastQA.question);
      setPhase('questioning');
    }
  }, [qaHistory, setCurrentQuestion, setPhase]);

  // Start discovery when panel opens (only if no existing conversation)
  useEffect(() => {
    if (isOpen && phase === 'loading' && !currentQuestion && qaHistory.length === 0) {
      startDiscovery();
    }
  }, [isOpen, phase, currentQuestion, qaHistory.length, startDiscovery]);

  // Handle close - DON'T reset, just close
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      close();
      // Don't reset - keep conversation state
    }
  }, [close]);

  // Handle new conversation - explicit reset
  const handleNewConversation = useCallback(() => {
    reset();
    // Start fresh
    setTimeout(() => {
      setPhase('loading');
      startDiscovery();
    }, 100);
  }, [reset, setPhase, startDiscovery]);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg h-full flex flex-col p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pb-0">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-primary" />
                  AI Discovery
                </SheetTitle>
                {qaHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewConversation}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon className="w-4 h-4 mr-1" />
                    New
                  </Button>
                )}
              </div>
              <SheetDescription>
                Let AI help you design your architecture through guided questions.
              </SheetDescription>
            </SheetHeader>

            <div className="py-4">
              <DiscoveryProgress />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-hidden px-6">
            <ScrollArea className="h-full">
              <div className="space-y-3 pb-4">
                {/* Error State */}
                {error && (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <AlertCircleIcon className="w-10 h-10 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" onClick={startDiscovery}>
                      <RefreshCwIcon className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                )}

                {/* Loading State */}
                {phase === 'loading' && !error && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {qaHistory.length === 0
                        ? 'Starting discovery...'
                        : 'Analyzing your response...'}
                    </p>
                  </div>
                )}

                {/* Q&A History - Compact */}
                {qaHistory.map((qa, i) => (
                  <div key={i} className="p-3 bg-muted/30 rounded-lg space-y-1.5 text-sm">
                    <div className="flex gap-2">
                      <span className="text-xs font-semibold text-primary shrink-0">AI:</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{qa.question}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs font-semibold text-foreground shrink-0">You:</span>
                      <p className="text-xs leading-relaxed">{qa.answer}</p>
                    </div>
                  </div>
                ))}

                {/* Current Question */}
                {phase === 'questioning' && currentQuestion && (
                  <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    isLoading={isLoading}
                  />
                )}

                {/* Summary */}
                {(phase === 'summarizing' || phase === 'generating') && summary && (
                  <DiscoverySummary
                    summary={summary}
                    onConfirm={handleGenerateDiagram}
                    onEdit={handleEdit}
                    isGenerating={phase === 'generating'}
                  />
                )}

                {/* Complete State */}
                {phase === 'complete' && (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <SparklesIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-sm font-medium">Diagram generated!</p>
                    <p className="text-xs text-muted-foreground">
                      Your AI architecture diagram is now on the canvas.
                    </p>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={scrollEndRef} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
