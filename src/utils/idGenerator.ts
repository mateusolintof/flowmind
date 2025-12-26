import { Node } from '@xyflow/react';

let counter = 0;

/**
 * Resets the ID counter based on existing nodes.
 * Calculates the maximum ID from nodes with format 'dndnode_X' and sets counter to max + 1.
 * This ensures new nodes don't have conflicting IDs.
 */
export function resetIdCounter(nodes: Node[]): void {
  const maxId = nodes.reduce((max, node) => {
    const match = node.id.match(/dndnode_(\d+)/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  counter = maxId + 1;
}

/**
 * Generates a unique node ID in the format 'dndnode_X'.
 * The counter auto-increments with each call.
 */
export function generateNodeId(): string {
  return `dndnode_${counter++}`;
}

/**
 * Gets the current counter value (useful for debugging).
 */
export function getCurrentCounter(): number {
  return counter;
}

/**
 * Manually sets the counter (use with caution).
 */
export function setCounter(value: number): void {
  counter = value;
}
