# CLAUDE.md - AI Assistant Context

This file provides context for AI assistants working on the FlowMind codebase.

## Project Overview

FlowMind is a visual diagram editor for designing AI system architectures. Built with Next.js 16, React 19, and @xyflow/react.

**Core Purpose:** Create professional diagrams for AI agent architectures, RAG pipelines, multi-agent systems, and flowcharts.

**Key Features:**
- **AI Architecture Diagrams** - Professional nodes for LLMs, agents, vector databases, etc.
- **Flowcharts** - Process diagrams with decision nodes
- **Brainstorming** - Free-form nodes with customizable icons
- **AI Discovery** - Guided AI assistant to help design architectures

---

## Node Type System (AI Architecture)

The node system is organized in semantic layers for creating professional AI architecture diagrams.

### Node Categories

| Category | Node Types | Purpose |
|----------|------------|---------|
| **Entrada** | `user`, `user-input`, `prompt` | Entry points - user, queries, instructions |
| **Conhecimento** | `knowledge-base`, `embedding`, `vector-db` | Data sources and semantic search |
| **Processamento** | `llm`, `agent`, `orchestrator`, `worker`, `classifier`, `retriever`, `reranker` | LLMs and AI agents |
| **Ferramentas** | `tool`, `api`, `code-exec` | External APIs and functions |
| **Memória** | `memory`, `conversation` | Context and history |
| **Saída** | `output`, `action` | Responses and real-world actions |
| **Estrutural** | `container`, `note` | Visual organization |
| **Flowchart** | `flowchart-*` | Process flow diagrams |

### Key Node Types

```
INPUT LAYER:
- user          → Human user
- user-input    → User message/query
- prompt        → System prompt/instructions

KNOWLEDGE LAYER:
- knowledge-base → Documents, FAQs, wikis
- embedding      → Embedding model (text-embedding-3)
- vector-db      → Vector database (Pinecone, Chroma)

PROCESSING LAYER:
- llm           → Language model (GPT, Claude, Llama)
- agent         → Generic AI agent
- orchestrator  → Coordinates other agents
- worker        → Specialized worker agent
- classifier    → Intent classifier/router
- retriever     → Fetches relevant documents
- reranker      → Re-orders by relevance

TOOLS LAYER:
- tool          → Generic tool/function
- api           → External API integration
- code-exec     → Code execution sandbox

MEMORY LAYER:
- memory        → Short-term memory/context
- conversation  → Conversation history

OUTPUT LAYER:
- output        → Final response to user
- action        → Real-world action
```

### Configuration Files

| File | Purpose |
|------|---------|
| `config/nodeTypes.ts` | AI Architecture node definitions (22 types) |
| `config/flowchartNodeTypes.ts` | Flowchart node definitions |
| `config/nodeCatalog.ts` | Sidebar categories + combined catalog |
| `config/templates.ts` | Pre-built diagram templates |

---

## Key Architecture Patterns

### Components

| File | Purpose |
|------|---------|
| `FlowCanvas.tsx` | Main canvas orchestrator |
| `BaseNode.tsx` | Renders AI Architecture nodes |
| `FlowchartNode.tsx` | Renders flowchart nodes |
| `GenericNode.tsx` | Customizable brainstorming node |
| `Sidebar.tsx` | Node library with categories |
| `CustomEdge.tsx` | Edge with labels and styles |

### State Management

Uses Zustand with Immer:

```
src/store/
├── flowStore.ts       # UI state (drawing, colors, etc.)
├── discoveryStore.ts  # AI Discovery state
├── undoRedoStore.ts   # History management
└── clipboardStore.ts  # Copy/paste state
```

**Important**: React Flow manages `nodes` and `edges` internally via `useNodesState` and `useEdgesState`.

### AI Discovery System

Located in `src/components/discovery/` and `src/lib/ai/`:
- `DiscoveryPanel.tsx` - Main discovery UI
- `prompts.ts` - AI prompts for diagram generation
- `client.ts` - Anthropic API client

---

## Common Tasks

### Adding a New Node Type

1. Add config to `src/config/nodeTypes.ts`
2. Add to appropriate category in `src/config/nodeCatalog.ts`
3. Node will automatically use `BaseNode.tsx` component

### Adding a New Template

Add to `src/config/templates.ts`:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  description: 'Description here',
  category: 'ai-agents', // or 'flowchart', 'general'
  nodes: [...],  // Use new node types
  edges: [...],
}
```

### Updating AI Discovery Prompts

Edit `src/lib/ai/prompts.ts` to update the `DIAGRAM_GENERATION_PROMPT` with new node types.

---

## Code Conventions

### TypeScript

- Use `NodeProps` from `@xyflow/react` for node components
- Cast `data` to specific type: `const nodeData = data as BaseNodeData;`
- Add index signature for React Flow compatibility

### Component Structure

```typescript
const MyNode = ({ data, selected, id }: NodeProps) => {
  const nodeData = data as BaseNodeData;
  const { setNodes } = useReactFlow();

  return (
    <div>
      <Handle type="target" position={Position.Top} />
      {/* Content */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(MyNode);
```

---

## Testing Changes

```bash
npm run build  # Check for TypeScript errors
npm run dev    # Test in development mode
```

The build must pass without errors before considering changes complete.

---

## File Organization

```
src/
├── app/              # Next.js pages
├── components/
│   ├── flow/         # Canvas, nodes, edges
│   ├── discovery/    # AI Discovery components
│   └── ui/           # shadcn/ui components
├── config/           # Node types, templates
├── hooks/            # Custom React hooks
├── store/            # Zustand stores
├── lib/              # AI client, storage, utilities
└── types/            # TypeScript types
```
