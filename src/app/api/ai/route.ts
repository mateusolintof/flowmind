/**
 * AI API Route for FlowMind
 *
 * Handles all AI-related requests securely on the server side.
 * The Anthropic API key is never exposed to the client.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, DEFAULT_MODEL, MAX_TOKENS } from '@/lib/ai/client';
import { SYSTEM_PROMPT, getPrompt, PromptType } from '@/lib/ai/prompts';

export interface AIRequestBody {
  type: PromptType;
  conversation?: string;
  summary?: string;
}

export interface AIResponse {
  content: string;
  isReady?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequestBody = await request.json();
    const { type, conversation, summary } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();

    // Build the prompt with variables
    const variables: Record<string, string> = {};
    if (conversation) variables.conversation = conversation;
    if (summary) variables.summary = summary;

    const userPrompt = getPrompt(type, variables);

    // Call the Anthropic API
    const response = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract the text content from the response
    const content = response.content
      .filter((block) => block.type === 'text')
      .map((block) => {
        if (block.type === 'text') {
          return block.text;
        }
        return '';
      })
      .join('');

    // Check if the response indicates the discovery is complete
    const isReady = content.trim() === '[READY]';

    const result: AIResponse = {
      content: isReady ? '' : content,
      isReady,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI API error:', error);

    if (error instanceof Error) {
      // Handle specific Anthropic errors
      if (error.message.includes('ANTHROPIC_API_KEY')) {
        return NextResponse.json(
          { error: 'API key not configured. Please contact support.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
