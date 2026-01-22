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

| File | Purpose |
|------|---------|
| `DiscoveryPanel.tsx` | Main discovery UI with Q&A flow |
| `DiscoveryProgress.tsx` | Dynamic progress bar (not hardcoded) |
| `DiscoverySummary.tsx` | Summary before diagram generation |
| `QuestionCard.tsx` | Question display with textarea input |
| `prompts.ts` | AI prompts for diagram generation |
| `client.ts` | Anthropic API client (server-side only) |

**useAI Hook** (`src/hooks/ai/useAI.ts`):
- 30-second timeout with AbortController
- Operation-specific error messages
- Request cancellation on panel close
- Retry support for failed operations

**Environment Variable Required:**
```env
ANTHROPIC_API_KEY=your_api_key
```

### Drawing System

| File | Purpose |
|------|---------|
| `DrawingOverlay.tsx` | Captures pointer events, shows real-time preview |
| `ShapeNode.tsx` | Geometric shapes with endpoint handles for resize |

**Key Features:**
- Real-time preview uses `flowToScreenPosition()` for correct coordinates
- Arrows/Lines have draggable endpoint handles when selected
- All shapes have color picker when selected

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
├── app/              # Next.js pages + API routes
│   └── api/ai/       # AI Discovery API endpoint
├── components/
│   ├── flow/         # Canvas, nodes, edges, drawing
│   ├── discovery/    # AI Discovery UI components
│   └── ui/           # shadcn/ui components
├── config/           # Node types, templates, shortcuts
├── hooks/
│   ├── ai/           # useAI (API calls with timeout)
│   ├── diagrams/     # useUndoRedo, useClipboard
│   ├── storage/      # useAutoSave, useSyncStatus
│   └── drawing/      # useDnD
├── store/            # Zustand stores (flow, discovery, undo)
├── lib/
│   ├── ai/           # Anthropic client, prompts
│   ├── storage/      # IndexedDB, Supabase
│   └── diagram/      # Export, auto-layout (dagre)
└── types/            # TypeScript types
```
