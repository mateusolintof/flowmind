import { Sparkles } from 'lucide-react';
import { NODE_CONFIG, type NodeType } from '@/config/nodeTypes';
import { FLOWCHART_NODE_CONFIG, type FlowchartNodeType } from '@/config/flowchartNodeTypes';

// Config for special nodes not in the standard configs
export const SPECIAL_NODE_CONFIG = {
  generic: {
    label: 'Free Node',
    icon: Sparkles,
    tooltip: 'Nó totalmente customizável - escolha qualquer ícone e cor',
    category: 'brainstorming' as const,
  },
} as const;

// Combined config for all node types
export const ALL_NODE_CONFIG = { ...NODE_CONFIG, ...FLOWCHART_NODE_CONFIG, ...SPECIAL_NODE_CONFIG };

export type AllNodeType = NodeType | FlowchartNodeType | keyof typeof SPECIAL_NODE_CONFIG;

/**
 * Node Categories for Sidebar
 *
 * Organização semântica dos nodes para facilitar a criação de diagramas
 * de arquitetura de IA profissionais.
 */
export const NODE_CATEGORIES = [
  {
    name: 'Brainstorming',
    description: 'Nó livre para ideias',
    items: ['generic'] as AllNodeType[],
  },
  {
    name: 'Entrada',
    description: 'Pontos de entrada do sistema',
    items: ['user', 'user-input', 'prompt'] as AllNodeType[],
  },
  {
    name: 'Conhecimento',
    description: 'Fontes de dados e busca semântica',
    items: ['knowledge-base', 'embedding', 'vector-db'] as AllNodeType[],
  },
  {
    name: 'Processamento',
    description: 'LLMs e Agentes de IA',
    items: ['llm', 'agent', 'orchestrator', 'worker', 'classifier', 'retriever', 'reranker'] as AllNodeType[],
  },
  {
    name: 'Ferramentas',
    description: 'APIs e funções externas',
    items: ['tool', 'api', 'code-exec'] as AllNodeType[],
  },
  {
    name: 'Memória',
    description: 'Contexto e histórico',
    items: ['memory', 'conversation'] as AllNodeType[],
  },
  {
    name: 'Saída',
    description: 'Respostas e ações',
    items: ['output', 'action'] as AllNodeType[],
  },
  {
    name: 'Estrutural',
    description: 'Organização visual',
    items: ['container', 'note'] as AllNodeType[],
  },
  {
    name: 'Flowchart',
    description: 'Diagramas de fluxo',
    items: [
      'flowchart-start',
      'flowchart-end',
      'flowchart-process',
      'flowchart-decision',
      'flowchart-data',
      'flowchart-io',
      'flowchart-condition',
      'flowchart-action',
      'flowchart-result',
      'flowchart-user',
      'flowchart-system',
    ] as AllNodeType[],
  },
] as const;

// List of node types that should use BaseNode component (not special like generic, flowchart, etc.)
export const BASE_NODE_TYPES: NodeType[] = [
  'user',
  'user-input',
  'prompt',
  'knowledge-base',
  'embedding',
  'vector-db',
  'llm',
  'agent',
  'orchestrator',
  'worker',
  'classifier',
  'retriever',
  'reranker',
  'tool',
  'api',
  'code-exec',
  'memory',
  'conversation',
  'output',
  'action',
  'container',
  'note',
];

// Node types that should appear in collapsed sidebar (mobile/small screens)
export const COLLAPSED_NODE_TYPES: AllNodeType[] = [
  // Most commonly used AI architecture nodes
  'user',
  'user-input',
  'agent',
  'orchestrator',
  'llm',
  'tool',
  'memory',
  'output',
  // Most commonly used flowchart nodes
  'flowchart-start',
  'flowchart-process',
  'flowchart-decision',
  'flowchart-end',
];
