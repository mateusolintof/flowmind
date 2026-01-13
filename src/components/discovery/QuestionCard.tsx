'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
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

      <div className="flex gap-2">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          disabled={isLoading}
          className="flex-1"
          autoFocus
        />
        <Button
          onClick={handleSubmit}
          disabled={!answer.trim() || isLoading}
          size="icon"
        >
          {isLoading ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            <SendIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
