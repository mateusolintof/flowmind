/**
 * Anthropic API Client for server-side use only
 *
 * This client should ONLY be used in API routes, never in client components.
 * The API key is kept secure on the server side.
 */

import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY is not set. Please add it to your .env.local file.'
      );
    }

    client = new Anthropic({
      apiKey,
    });
  }

  return client;
}

export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
export const MAX_TOKENS = 2048;
