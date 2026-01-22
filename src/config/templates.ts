import { Node, Edge } from '@xyflow/react';

export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  category: 'ai-agents' | 'architecture' | 'flowchart' | 'general';
  thumbnail?: string;
  nodes: Node[];
  edges: Edge[];
}

/**
 * Diagram Templates
 *
 * Templates atualizados com a nova ontologia de nodes para
 * arquitetura de agentes de IA.
 */
export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // AI AGENTS TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'single-agent',
    name: 'Single AI Agent',
    description: 'Agente de IA básico com ferramentas e memória',
    category: 'ai-agents',
    nodes: [
      {
        id: 'user-1',
        type: 'user',
        position: { x: 50, y: 150 },
        data: { label: 'Usuário' },
      },
      {
        id: 'input-1',
        type: 'user-input',
        position: { x: 200, y: 150 },
        data: { label: 'Query' },
      },
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 400, y: 100 },
        data: { label: 'Agente IA' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 400, y: 250 },
        data: { label: 'LLM' },
      },
      {
        id: 'memory-1',
        type: 'memory',
        position: { x: 600, y: 50 },
        data: { label: 'Memória' },
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 600, y: 150 },
        data: { label: 'Web Search' },
      },
      {
        id: 'tool-2',
        type: 'tool',
        position: { x: 600, y: 250 },
        data: { label: 'Calculator' },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 800, y: 150 },
        data: { label: 'Resposta' },
      },
    ],
    edges: [
      { id: 'e1', source: 'user-1', target: 'input-1', type: 'custom' },
      { id: 'e2', source: 'input-1', target: 'agent-1', type: 'custom' },
      { id: 'e3', source: 'agent-1', target: 'llm-1', type: 'custom' },
      { id: 'e4', source: 'agent-1', target: 'memory-1', type: 'custom' },
      { id: 'e5', source: 'agent-1', target: 'tool-1', type: 'custom' },
      { id: 'e6', source: 'agent-1', target: 'tool-2', type: 'custom' },
      { id: 'e7', source: 'agent-1', target: 'output-1', type: 'custom' },
    ],
  },
  {
    id: 'multi-agent',
    name: 'Multi-Agent System',
    description: 'Orquestrador com agentes worker especializados',
    category: 'ai-agents',
    nodes: [
      {
        id: 'user-1',
        type: 'user',
        position: { x: 50, y: 200 },
        data: { label: 'Usuário' },
      },
      {
        id: 'input-1',
        type: 'user-input',
        position: { x: 200, y: 200 },
        data: { label: 'Tarefa' },
      },
      {
        id: 'orchestrator-1',
        type: 'orchestrator',
        position: { x: 400, y: 200 },
        data: { label: 'Orquestrador' },
      },
      {
        id: 'worker-research',
        type: 'worker',
        position: { x: 600, y: 50 },
        data: { label: 'Research Worker' },
      },
      {
        id: 'worker-writer',
        type: 'worker',
        position: { x: 600, y: 200 },
        data: { label: 'Writer Worker' },
      },
      {
        id: 'worker-reviewer',
        type: 'worker',
        position: { x: 600, y: 350 },
        data: { label: 'Reviewer Worker' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 800, y: 200 },
        data: { label: 'LLM Compartilhado' },
      },
      {
        id: 'memory-1',
        type: 'memory',
        position: { x: 400, y: 400 },
        data: { label: 'Memória Compartilhada' },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 1000, y: 200 },
        data: { label: 'Resultado' },
      },
    ],
    edges: [
      { id: 'e1', source: 'user-1', target: 'input-1', type: 'custom' },
      { id: 'e2', source: 'input-1', target: 'orchestrator-1', type: 'custom' },
      { id: 'e3', source: 'orchestrator-1', target: 'worker-research', type: 'custom' },
      { id: 'e4', source: 'orchestrator-1', target: 'worker-writer', type: 'custom' },
      { id: 'e5', source: 'orchestrator-1', target: 'worker-reviewer', type: 'custom' },
      { id: 'e6', source: 'worker-research', target: 'llm-1', type: 'custom' },
      { id: 'e7', source: 'worker-writer', target: 'llm-1', type: 'custom' },
      { id: 'e8', source: 'worker-reviewer', target: 'llm-1', type: 'custom' },
      { id: 'e9', source: 'orchestrator-1', target: 'memory-1', type: 'custom' },
      { id: 'e10', source: 'llm-1', target: 'output-1', type: 'custom' },
    ],
  },
  {
    id: 'rag-pipeline',
    name: 'RAG Pipeline',
    description: 'Sistema de Retrieval-Augmented Generation',
    category: 'ai-agents',
    nodes: [
      {
        id: 'user-1',
        type: 'user',
        position: { x: 50, y: 200 },
        data: { label: 'Usuário' },
      },
      {
        id: 'input-1',
        type: 'user-input',
        position: { x: 200, y: 200 },
        data: { label: 'Query' },
      },
      {
        id: 'knowledge-1',
        type: 'knowledge-base',
        position: { x: 400, y: 50 },
        data: { label: 'Documentos' },
      },
      {
        id: 'embedding-1',
        type: 'embedding',
        position: { x: 400, y: 200 },
        data: { label: 'Embedding Model' },
      },
      {
        id: 'vectordb-1',
        type: 'vector-db',
        position: { x: 600, y: 100 },
        data: { label: 'Vector Database' },
      },
      {
        id: 'retriever-1',
        type: 'retriever',
        position: { x: 600, y: 250 },
        data: { label: 'Retriever' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 800, y: 200 },
        data: { label: 'LLM' },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 1000, y: 200 },
        data: { label: 'Resposta' },
      },
    ],
    edges: [
      { id: 'e1', source: 'user-1', target: 'input-1', type: 'custom' },
      { id: 'e2', source: 'input-1', target: 'embedding-1', type: 'custom' },
      { id: 'e3', source: 'knowledge-1', target: 'embedding-1', type: 'custom', label: 'indexação' },
      { id: 'e4', source: 'embedding-1', target: 'vectordb-1', type: 'custom' },
      { id: 'e5', source: 'vectordb-1', target: 'retriever-1', type: 'custom' },
      { id: 'e6', source: 'retriever-1', target: 'llm-1', type: 'custom', label: 'contexto' },
      { id: 'e7', source: 'input-1', target: 'llm-1', type: 'custom', label: 'query' },
      { id: 'e8', source: 'llm-1', target: 'output-1', type: 'custom' },
    ],
  },
  {
    id: 'rag-reranking',
    name: 'RAG com Reranking',
    description: 'RAG avançado com reranking para maior precisão',
    category: 'ai-agents',
    nodes: [
      {
        id: 'user-1',
        type: 'user',
        position: { x: 50, y: 200 },
        data: { label: 'Usuário' },
      },
      {
        id: 'input-1',
        type: 'user-input',
        position: { x: 200, y: 200 },
        data: { label: 'Query' },
      },
      {
        id: 'knowledge-1',
        type: 'knowledge-base',
        position: { x: 350, y: 50 },
        data: { label: 'Documentos' },
      },
      {
        id: 'embedding-1',
        type: 'embedding',
        position: { x: 350, y: 200 },
        data: { label: 'Embedding' },
      },
      {
        id: 'vectordb-1',
        type: 'vector-db',
        position: { x: 500, y: 100 },
        data: { label: 'Vector DB' },
      },
      {
        id: 'retriever-1',
        type: 'retriever',
        position: { x: 650, y: 200 },
        data: { label: 'Retriever (top-k)' },
      },
      {
        id: 'reranker-1',
        type: 'reranker',
        position: { x: 800, y: 200 },
        data: { label: 'Reranker' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 950, y: 200 },
        data: { label: 'LLM' },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 1100, y: 200 },
        data: { label: 'Resposta' },
      },
    ],
    edges: [
      { id: 'e1', source: 'user-1', target: 'input-1', type: 'custom' },
      { id: 'e2', source: 'input-1', target: 'embedding-1', type: 'custom' },
      { id: 'e3', source: 'knowledge-1', target: 'vectordb-1', type: 'custom' },
      { id: 'e4', source: 'embedding-1', target: 'vectordb-1', type: 'custom' },
      { id: 'e5', source: 'vectordb-1', target: 'retriever-1', type: 'custom' },
      { id: 'e6', source: 'retriever-1', target: 'reranker-1', type: 'custom' },
      { id: 'e7', source: 'reranker-1', target: 'llm-1', type: 'custom', label: 'contexto' },
      { id: 'e8', source: 'input-1', target: 'llm-1', type: 'custom', label: 'query' },
      { id: 'e9', source: 'llm-1', target: 'output-1', type: 'custom' },
    ],
  },
  {
    id: 'customer-service',
    name: 'Customer Service Agent',
    description: 'Agente para qualificação de leads e agendamento',
    category: 'ai-agents',
    nodes: [
      {
        id: 'customer-1',
        type: 'user',
        position: { x: 50, y: 200 },
        data: { label: 'Cliente' },
      },
      {
        id: 'input-msg',
        type: 'user-input',
        position: { x: 200, y: 200 },
        data: { label: 'Mensagem', description: 'WhatsApp, Email, Chat' },
      },
      {
        id: 'classifier-1',
        type: 'classifier',
        position: { x: 400, y: 200 },
        data: { label: 'Classificador de Intent' },
      },
      {
        id: 'worker-qualify',
        type: 'worker',
        position: { x: 600, y: 100 },
        data: { label: 'Qualification Worker' },
      },
      {
        id: 'worker-scheduler',
        type: 'worker',
        position: { x: 600, y: 300 },
        data: { label: 'Scheduler Worker' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 800, y: 200 },
        data: { label: 'Claude/GPT' },
      },
      {
        id: 'conversation-1',
        type: 'conversation',
        position: { x: 800, y: 50 },
        data: { label: 'Histórico' },
      },
      {
        id: 'api-calendar',
        type: 'api',
        position: { x: 800, y: 350 },
        data: { label: 'Google Calendar' },
      },
      {
        id: 'api-crm',
        type: 'api',
        position: { x: 800, y: 450 },
        data: { label: 'CRM (HubSpot)' },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 1000, y: 200 },
        data: { label: 'Resposta' },
      },
    ],
    edges: [
      { id: 'cs-e1', source: 'customer-1', target: 'input-msg', type: 'custom' },
      { id: 'cs-e2', source: 'input-msg', target: 'classifier-1', type: 'custom' },
      { id: 'cs-e3', source: 'classifier-1', target: 'worker-qualify', type: 'custom', label: 'qualificar' },
      { id: 'cs-e4', source: 'classifier-1', target: 'worker-scheduler', type: 'custom', label: 'agendar' },
      { id: 'cs-e5', source: 'worker-qualify', target: 'llm-1', type: 'custom' },
      { id: 'cs-e6', source: 'worker-scheduler', target: 'llm-1', type: 'custom' },
      { id: 'cs-e7', source: 'worker-qualify', target: 'conversation-1', type: 'custom' },
      { id: 'cs-e8', source: 'worker-scheduler', target: 'api-calendar', type: 'custom' },
      { id: 'cs-e9', source: 'worker-qualify', target: 'api-crm', type: 'custom' },
      { id: 'cs-e10', source: 'llm-1', target: 'output-1', type: 'custom' },
    ],
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    description: 'Agente que pesquisa, sintetiza e gera relatórios',
    category: 'ai-agents',
    nodes: [
      {
        id: 'user-query',
        type: 'user',
        position: { x: 50, y: 200 },
        data: { label: 'Usuário' },
      },
      {
        id: 'input-query',
        type: 'user-input',
        position: { x: 200, y: 200 },
        data: { label: 'Pergunta de Pesquisa' },
      },
      {
        id: 'orchestrator-1',
        type: 'orchestrator',
        position: { x: 400, y: 200 },
        data: { label: 'Research Orchestrator' },
      },
      {
        id: 'api-search',
        type: 'api',
        position: { x: 600, y: 50 },
        data: { label: 'Web Search API' },
      },
      {
        id: 'tool-reader',
        type: 'tool',
        position: { x: 600, y: 150 },
        data: { label: 'Document Reader' },
      },
      {
        id: 'memory-notes',
        type: 'memory',
        position: { x: 600, y: 250 },
        data: { label: 'Research Notes' },
      },
      {
        id: 'worker-synth',
        type: 'worker',
        position: { x: 600, y: 350 },
        data: { label: 'Synthesizer Worker' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 800, y: 200 },
        data: { label: 'LLM' },
      },
      {
        id: 'output-report',
        type: 'output',
        position: { x: 1000, y: 200 },
        data: { label: 'Relatório' },
      },
    ],
    edges: [
      { id: 'ra-e1', source: 'user-query', target: 'input-query', type: 'custom' },
      { id: 'ra-e2', source: 'input-query', target: 'orchestrator-1', type: 'custom' },
      { id: 'ra-e3', source: 'orchestrator-1', target: 'api-search', type: 'custom' },
      { id: 'ra-e4', source: 'orchestrator-1', target: 'tool-reader', type: 'custom' },
      { id: 'ra-e5', source: 'api-search', target: 'memory-notes', type: 'custom' },
      { id: 'ra-e6', source: 'tool-reader', target: 'memory-notes', type: 'custom' },
      { id: 'ra-e7', source: 'memory-notes', target: 'worker-synth', type: 'custom' },
      { id: 'ra-e8', source: 'worker-synth', target: 'llm-1', type: 'custom' },
      { id: 'ra-e9', source: 'llm-1', target: 'output-report', type: 'custom' },
    ],
  },
  {
    id: 'code-review',
    name: 'Code Review Agent',
    description: 'Agente que analisa PRs e sugere melhorias',
    category: 'ai-agents',
    nodes: [
      {
        id: 'dev-user',
        type: 'user',
        position: { x: 50, y: 200 },
        data: { label: 'Developer' },
      },
      {
        id: 'input-pr',
        type: 'user-input',
        position: { x: 200, y: 200 },
        data: { label: 'PR / Diff' },
      },
      {
        id: 'agent-analyzer',
        type: 'agent',
        position: { x: 400, y: 100 },
        data: { label: 'Code Analyzer' },
      },
      {
        id: 'worker-reviewer',
        type: 'worker',
        position: { x: 400, y: 300 },
        data: { label: 'Review Worker' },
      },
      {
        id: 'api-github',
        type: 'api',
        position: { x: 600, y: 50 },
        data: { label: 'GitHub API' },
      },
      {
        id: 'code-exec-1',
        type: 'code-exec',
        position: { x: 600, y: 150 },
        data: { label: 'Linter / Tests' },
      },
      {
        id: 'knowledge-standards',
        type: 'knowledge-base',
        position: { x: 600, y: 250 },
        data: { label: 'Code Standards' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 600, y: 350 },
        data: { label: 'LLM' },
      },
      {
        id: 'output-comments',
        type: 'output',
        position: { x: 800, y: 200 },
        data: { label: 'Review Comments' },
      },
    ],
    edges: [
      { id: 'cr-e1', source: 'dev-user', target: 'input-pr', type: 'custom' },
      { id: 'cr-e2', source: 'input-pr', target: 'agent-analyzer', type: 'custom' },
      { id: 'cr-e3', source: 'agent-analyzer', target: 'api-github', type: 'custom' },
      { id: 'cr-e4', source: 'agent-analyzer', target: 'code-exec-1', type: 'custom' },
      { id: 'cr-e5', source: 'agent-analyzer', target: 'worker-reviewer', type: 'custom' },
      { id: 'cr-e6', source: 'worker-reviewer', target: 'knowledge-standards', type: 'custom' },
      { id: 'cr-e7', source: 'worker-reviewer', target: 'llm-1', type: 'custom' },
      { id: 'cr-e8', source: 'llm-1', target: 'output-comments', type: 'custom' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOWCHART TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'basic-flowchart',
    name: 'Basic Flowchart',
    description: 'Fluxo simples com início, processo, decisão e fim',
    category: 'flowchart',
    nodes: [
      {
        id: 'fc-start',
        type: 'flowchart-start',
        position: { x: 250, y: 50 },
        data: { label: 'Início' },
      },
      {
        id: 'fc-input',
        type: 'flowchart-io',
        position: { x: 250, y: 150 },
        data: { label: 'Input do Usuário' },
      },
      {
        id: 'fc-process1',
        type: 'flowchart-process',
        position: { x: 250, y: 250 },
        data: { label: 'Processar Dados' },
      },
      {
        id: 'fc-decision',
        type: 'flowchart-decision',
        position: { x: 250, y: 350 },
        data: { label: 'É Válido?' },
      },
      {
        id: 'fc-success',
        type: 'flowchart-result',
        position: { x: 100, y: 470 },
        data: { label: 'Sucesso' },
      },
      {
        id: 'fc-error',
        type: 'flowchart-action',
        position: { x: 400, y: 470 },
        data: { label: 'Tratar Erro' },
      },
      {
        id: 'fc-end',
        type: 'flowchart-end',
        position: { x: 250, y: 580 },
        data: { label: 'Fim' },
      },
    ],
    edges: [
      { id: 'fc-e1', source: 'fc-start', target: 'fc-input', type: 'custom' },
      { id: 'fc-e2', source: 'fc-input', target: 'fc-process1', type: 'custom' },
      { id: 'fc-e3', source: 'fc-process1', target: 'fc-decision', type: 'custom' },
      { id: 'fc-e4', source: 'fc-decision', target: 'fc-success', type: 'custom', label: 'Sim', data: { labelPreset: 'success' } },
      { id: 'fc-e5', source: 'fc-decision', target: 'fc-error', type: 'custom', label: 'Não', data: { labelPreset: 'error' } },
      { id: 'fc-e6', source: 'fc-success', target: 'fc-end', type: 'custom' },
      { id: 'fc-e7', source: 'fc-error', target: 'fc-end', type: 'custom' },
    ],
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree',
    description: 'Estrutura de ramificação de decisões multinível',
    category: 'flowchart',
    nodes: [
      {
        id: 'dt-start',
        type: 'flowchart-start',
        position: { x: 350, y: 50 },
        data: { label: 'Início' },
      },
      {
        id: 'dt-condition1',
        type: 'flowchart-condition',
        position: { x: 350, y: 150 },
        data: { label: 'Condição A' },
      },
      {
        id: 'dt-condition2',
        type: 'flowchart-condition',
        position: { x: 150, y: 280 },
        data: { label: 'Condição B' },
      },
      {
        id: 'dt-condition3',
        type: 'flowchart-condition',
        position: { x: 550, y: 280 },
        data: { label: 'Condição C' },
      },
      {
        id: 'dt-action1',
        type: 'flowchart-action',
        position: { x: 50, y: 410 },
        data: { label: 'Ação 1' },
      },
      {
        id: 'dt-action2',
        type: 'flowchart-action',
        position: { x: 250, y: 410 },
        data: { label: 'Ação 2' },
      },
      {
        id: 'dt-action3',
        type: 'flowchart-action',
        position: { x: 450, y: 410 },
        data: { label: 'Ação 3' },
      },
      {
        id: 'dt-action4',
        type: 'flowchart-action',
        position: { x: 650, y: 410 },
        data: { label: 'Ação 4' },
      },
      {
        id: 'dt-end',
        type: 'flowchart-end',
        position: { x: 350, y: 530 },
        data: { label: 'Fim' },
      },
    ],
    edges: [
      { id: 'dt-e1', source: 'dt-start', target: 'dt-condition1', type: 'custom' },
      { id: 'dt-e2', source: 'dt-condition1', target: 'dt-condition2', type: 'custom', label: 'Sim', data: { labelPreset: 'success' } },
      { id: 'dt-e3', source: 'dt-condition1', target: 'dt-condition3', type: 'custom', label: 'Não', data: { labelPreset: 'warning' } },
      { id: 'dt-e4', source: 'dt-condition2', target: 'dt-action1', type: 'custom', label: 'Sim', data: { labelPreset: 'success' } },
      { id: 'dt-e5', source: 'dt-condition2', target: 'dt-action2', type: 'custom', label: 'Não', data: { labelPreset: 'warning' } },
      { id: 'dt-e6', source: 'dt-condition3', target: 'dt-action3', type: 'custom', label: 'Sim', data: { labelPreset: 'success' } },
      { id: 'dt-e7', source: 'dt-condition3', target: 'dt-action4', type: 'custom', label: 'Não', data: { labelPreset: 'warning' } },
      { id: 'dt-e8', source: 'dt-action1', target: 'dt-end', type: 'custom' },
      { id: 'dt-e9', source: 'dt-action2', target: 'dt-end', type: 'custom' },
      { id: 'dt-e10', source: 'dt-action3', target: 'dt-end', type: 'custom' },
      { id: 'dt-e11', source: 'dt-action4', target: 'dt-end', type: 'custom' },
    ],
  },
  {
    id: 'data-pipeline-etl',
    name: 'Data Pipeline (ETL)',
    description: 'Pipeline de Extract, Transform, Load com validação',
    category: 'flowchart',
    nodes: [
      {
        id: 'etl-start',
        type: 'flowchart-start',
        position: { x: 300, y: 50 },
        data: { label: 'Início' },
      },
      {
        id: 'etl-extract',
        type: 'flowchart-process',
        position: { x: 300, y: 150 },
        data: { label: 'Extract' },
      },
      {
        id: 'etl-validate-schema',
        type: 'flowchart-condition',
        position: { x: 300, y: 260 },
        data: { label: 'Schema Válido?' },
      },
      {
        id: 'etl-transform',
        type: 'flowchart-process',
        position: { x: 150, y: 380 },
        data: { label: 'Transform' },
      },
      {
        id: 'etl-error-log',
        type: 'flowchart-action',
        position: { x: 450, y: 380 },
        data: { label: 'Log Error' },
      },
      {
        id: 'etl-quality-check',
        type: 'flowchart-condition',
        position: { x: 150, y: 500 },
        data: { label: 'Quality OK?' },
      },
      {
        id: 'etl-load',
        type: 'flowchart-process',
        position: { x: 50, y: 620 },
        data: { label: 'Load' },
      },
      {
        id: 'etl-quarantine',
        type: 'flowchart-action',
        position: { x: 250, y: 620 },
        data: { label: 'Quarantine' },
      },
      {
        id: 'etl-end',
        type: 'flowchart-end',
        position: { x: 150, y: 740 },
        data: { label: 'Fim' },
      },
    ],
    edges: [
      { id: 'etl-e1', source: 'etl-start', target: 'etl-extract', type: 'custom' },
      { id: 'etl-e2', source: 'etl-extract', target: 'etl-validate-schema', type: 'custom' },
      { id: 'etl-e3', source: 'etl-validate-schema', target: 'etl-transform', type: 'custom', label: 'Sim', data: { labelPreset: 'success' } },
      { id: 'etl-e4', source: 'etl-validate-schema', target: 'etl-error-log', type: 'custom', label: 'Não', data: { labelPreset: 'error' } },
      { id: 'etl-e5', source: 'etl-transform', target: 'etl-quality-check', type: 'custom' },
      { id: 'etl-e6', source: 'etl-quality-check', target: 'etl-load', type: 'custom', label: 'Sim', data: { labelPreset: 'success' } },
      { id: 'etl-e7', source: 'etl-quality-check', target: 'etl-quarantine', type: 'custom', label: 'Não', data: { labelPreset: 'warning' } },
      { id: 'etl-e8', source: 'etl-load', target: 'etl-end', type: 'custom' },
      { id: 'etl-e9', source: 'etl-quarantine', target: 'etl-end', type: 'custom' },
      { id: 'etl-e10', source: 'etl-error-log', target: 'etl-end', type: 'custom' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERAL TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Começar do zero',
    category: 'general',
    nodes: [],
    edges: [],
  },
];

export function getTemplatesByCategory(category?: string) {
  if (!category || category === 'all') return DIAGRAM_TEMPLATES;
  return DIAGRAM_TEMPLATES.filter((t) => t.category === category);
}
