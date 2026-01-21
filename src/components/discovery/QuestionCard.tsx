'use client';

import { useState, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2Icon } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  onAnswer: (answer: string) => void;
  isLoading?: boolean;
}

export function QuestionCard({ question, onAnswer, isLoading }: QuestionCardProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = useCallback(() => {
    if (answer.trim() && !isLoading) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  }, [answer, isLoading, onAnswer]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Cmd/Ctrl + Enter to submit (allows regular Enter for new lines)
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-primary">AI</span>
        </div>
        <p className="text-sm leading-relaxed pt-1">{question}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Textarea
          value={answer}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer... (Cmd+Enter to send)"
          disabled={isLoading}
          className="min-h-[100px] max-h-[300px] resize-y"
          autoFocus
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Press Cmd+Enter to send
          </span>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <SendIcon className="w-4 h-4 mr-2" />
            )}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
