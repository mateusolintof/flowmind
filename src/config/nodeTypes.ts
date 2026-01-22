import {
  // Input Layer
  User,
  MessageSquare,
  FileText,
  // Knowledge Layer
  Library,
  Cpu,
  Database,
  // Processing Layer
  Brain,
  Bot,
  Network,
  Cog,
  GitBranch,
  Search,
  ListOrdered,
  // Tools Layer
  Wrench,
  Globe,
  Terminal,
  // Memory Layer
  HardDrive,
  MessagesSquare,
  // Output Layer
  Send,
  Zap,
  // Structural
  Box,
  StickyNote,
} from 'lucide-react';

/**
 * AI Architecture Node Configuration
 *
 * Nova ontologia de nodes para criar diagramas profissionais de arquitetura de IA.
 * Organizado em camadas semânticas: Entrada, Conhecimento, Processamento, Ferramentas, Memória, Saída, Estrutural.
 */
export const NODE_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUT LAYER - Pontos de entrada do sistema
  // ═══════════════════════════════════════════════════════════════════════════
  'user': {
    label: 'Usuário',
    icon: User,
    color: 'border-gray-500 bg-gray-50',
    tooltip: 'Pessoa que interage com o sistema',
    category: 'input' as const,
  },
  'user-input': {
    label: 'Input',
    icon: MessageSquare,
    color: 'border-green-500 bg-green-50',
    tooltip: 'Mensagem, query ou comando do usuário',
    category: 'input' as const,
  },
  'prompt': {
    label: 'Prompt',
    icon: FileText,
    color: 'border-sky-500 bg-sky-50',
    tooltip: 'System prompt, instruções do agente',
    category: 'input' as const,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KNOWLEDGE LAYER - Fontes de dados e busca semântica
  // ═══════════════════════════════════════════════════════════════════════════
  'knowledge-base': {
    label: 'Base de Conhecimento',
    icon: Library,
    color: 'border-amber-500 bg-amber-50',
    tooltip: 'Documentos, FAQs, wikis, corpus de conhecimento',
    category: 'knowledge' as const,
  },
  'embedding': {
    label: 'Embedding',
    icon: Cpu,
    color: 'border-violet-400 bg-violet-50',
    tooltip: 'Modelo de embedding (text-embedding-3, etc)',
    category: 'knowledge' as const,
  },
  'vector-db': {
    label: 'Vector Database',
    icon: Database,
    color: 'border-cyan-500 bg-cyan-50',
    tooltip: 'Pinecone, Chroma, Weaviate, Qdrant',
    category: 'knowledge' as const,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROCESSING LAYER - LLMs e Agentes
  // ═══════════════════════════════════════════════════════════════════════════
  'llm': {
    label: 'LLM',
    icon: Brain,
    color: 'border-purple-500 bg-purple-50',
    tooltip: 'Modelo de linguagem (GPT, Claude, Llama, Gemini)',
    category: 'processing' as const,
  },
  'agent': {
    label: 'Agente',
    icon: Bot,
    color: 'border-blue-500 bg-blue-50',
    tooltip: 'Agente de IA genérico',
    category: 'processing' as const,
  },
  'orchestrator': {
    label: 'Orquestrador',
    icon: Network,
    color: 'border-blue-700 bg-blue-100',
    tooltip: 'Agente que coordena outros agentes',
    category: 'processing' as const,
  },
  'worker': {
    label: 'Worker',
    icon: Cog,
    color: 'border-blue-400 bg-blue-50',
    tooltip: 'Agente especializado em uma tarefa',
    category: 'processing' as const,
  },
  'classifier': {
    label: 'Classificador',
    icon: GitBranch,
    color: 'border-yellow-500 bg-yellow-50',
    tooltip: 'Agente que roteia/classifica intents',
    category: 'processing' as const,
  },
  'retriever': {
    label: 'Retriever',
    icon: Search,
    color: 'border-green-600 bg-green-50',
    tooltip: 'Componente que busca documentos relevantes',
    category: 'processing' as const,
  },
  'reranker': {
    label: 'Reranker',
    icon: ListOrdered,
    color: 'border-orange-500 bg-orange-50',
    tooltip: 'Reordena resultados por relevância',
    category: 'processing' as const,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS LAYER - APIs e funções externas
  // ═══════════════════════════════════════════════════════════════════════════
  'tool': {
    label: 'Ferramenta',
    icon: Wrench,
    color: 'border-orange-500 bg-orange-50',
    tooltip: 'Ferramenta/função genérica',
    category: 'tools' as const,
  },
  'api': {
    label: 'API Externa',
    icon: Globe,
    color: 'border-emerald-600 bg-emerald-50',
    tooltip: 'Integração com API externa',
    category: 'tools' as const,
  },
  'code-exec': {
    label: 'Code Executor',
    icon: Terminal,
    color: 'border-gray-700 bg-gray-100',
    tooltip: 'Sandbox para executar código',
    category: 'tools' as const,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY LAYER - Contexto e histórico
  // ═══════════════════════════════════════════════════════════════════════════
  'memory': {
    label: 'Memória',
    icon: HardDrive,
    color: 'border-yellow-500 bg-yellow-50',
    tooltip: 'Memória de curto prazo / contexto',
    category: 'memory' as const,
  },
  'conversation': {
    label: 'Histórico',
    icon: MessagesSquare,
    color: 'border-yellow-400 bg-yellow-50',
    tooltip: 'Histórico de conversação',
    category: 'memory' as const,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUT LAYER - Respostas e ações
  // ═══════════════════════════════════════════════════════════════════════════
  'output': {
    label: 'Saída',
    icon: Send,
    color: 'border-emerald-500 bg-emerald-50',
    tooltip: 'Resposta final ao usuário',
    category: 'output' as const,
  },
  'action': {
    label: 'Ação',
    icon: Zap,
    color: 'border-pink-500 bg-pink-50',
    tooltip: 'Ação executada no mundo real',
    category: 'output' as const,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STRUCTURAL - Organização e anotações
  // ═══════════════════════════════════════════════════════════════════════════
  'container': {
    label: 'Container',
    icon: Box,
    color: 'border-dashed border-gray-400 bg-transparent',
    tooltip: 'Agrupa componentes relacionados',
    category: 'structural' as const,
  },
  'note': {
    label: 'Nota',
    icon: StickyNote,
    color: 'border-yellow-200 bg-yellow-100',
    tooltip: 'Anotação explicativa',
    category: 'structural' as const,
  },
} as const;

export type NodeType = keyof typeof NODE_CONFIG;
export type NodeCategory = 'input' | 'knowledge' | 'processing' | 'tools' | 'memory' | 'output' | 'structural';
