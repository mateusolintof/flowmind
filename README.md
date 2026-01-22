# FlowMind

A hybrid visual diagram editor for brainstorming, flowcharts, AI agent architectures, and software systems. Create beautiful diagrams with an intuitive drag-and-drop interface and Excalidraw-style drawing tools.

![FlowMind](https://img.shields.io/badge/version-0.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

## Features

### Core Features
- **33+ Node Types** - AI Architecture (22), Flowchart (11), and Brainstorming nodes
- **AI Discovery** - Guided AI assistant to help design your architecture (powered by Claude)
- **Shape Drawing Tools** - Rectangle, Ellipse, Arrow, Line (Excalidraw-style)
- **Freehand Drawing** - Sketch annotations directly on the canvas
- **Auto-Save** - Local (IndexedDB) + Cloud (Supabase) synchronization
- **Undo/Redo** - Full history with 30 states
- **Multiple Diagrams** - Create, rename, duplicate, and delete diagrams

### AI Discovery
- **Guided Questions** - AI asks questions to understand your requirements
- **Dynamic Progress** - Visual progress indicator that adapts to conversation
- **Auto-Summary** - AI generates a summary before creating the diagram
- **Diagram Generation** - Automatically creates nodes and connections based on your answers
- **Auto-Layout** - Uses dagre for optimal node positioning
- **Retry Support** - "Try Again" retries the specific failed operation, not the whole flow

### Node Customization
- **Inline Color Picker** - Change node colors by clicking the color dot when selected
- **Inline Icon Picker** - 60+ icons for GenericNode (Free Node)
- **Editable Labels** - Click on any label to edit
- **Descriptions** - Add descriptions that appear on hover
- **Resizable** - Drag corners to resize nodes

### Drawing Tools
- **Select (V)** - Move and select elements
- **Pencil (P)** - Freehand drawing
- **Arrow (A)** - Draw arrows with real-time preview
- **Rectangle (R)** - Draw rectangles with connectable handles
- **Ellipse (O)** - Draw circles/ellipses with connectable handles
- **Line (L)** - Draw straight lines with real-time preview
- **Resizable Shapes** - Drag corners/endpoints to resize after creation
- **Color Picker** - Change colors on any selected shape

### Productivity
- **Keyboard Shortcuts** - Full keyboard support (see table below)
- **Templates** - Pre-built diagrams for common patterns
- **Snap to Grid** - Align components precisely
- **Copy/Paste** - Duplicate nodes with their connections

### Visual/UX
- **Custom Edge Styles** - Bezier, Step, Straight lines with colors and labels
- **Edge Label Presets** - Success (green), Warning (yellow), Error (red), Info (blue)
- **Zoom Controls** - Visual zoom in/out with percentage display
- **Unsaved Indicator** - Dot next to the diagram name when there are pending changes
- **Responsive Design** - Works on desktop and mobile with collapsible sidebar
- **Premium UI** - "Midnight Blue & Gold" (Dark) and "Porcelain & Navy" (Light) themes
- **Theme Support** - Light/Dark/System toggle with persistent preference

### Export/Import
- **PNG Export** - High-resolution image export
- **SVG Export** - Vector format for scalability
- **JSON Export/Import** - Backup and share diagrams

## Node Types

| Category | Nodes | Description |
|----------|-------|-------------|
| **Brainstorming** | Free Node | Fully customizable - pick any icon (60+) and color |
| **Entrada** | User, User Input, Prompt | Entry points - user, queries, instructions |
| **Conhecimento** | Knowledge Base, Embedding, Vector DB | Data sources and semantic search |
| **Processamento** | LLM, Agent, Orchestrator, Worker, Classifier, Retriever, Reranker | LLMs and AI agents |
| **Ferramentas** | Tool, API, Code Executor | External APIs and functions |
| **Memória** | Memory, Conversation | Context and history |
| **Saída** | Output, Action | Responses and real-world actions |
| **Estrutural** | Container, Note | Visual organization |
| **Flowchart** | Start, End, Process, Decision, Data, I/O, Condition, Action, Result, User Action, System | Professional flowchart nodes |

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.1 with App Router |
| **UI Library** | React 19 |
| **Flow Library** | @xyflow/react 12.10 |
| **State Management** | Zustand with Immer |
| **Styling** | Tailwind CSS 4, Radix UI, shadcn/ui |
| **Animations** | Framer Motion |
| **Drawing** | perfect-freehand |
| **AI** | Anthropic Claude API (@anthropic-ai/sdk) |
| **Auto-Layout** | dagre (graph layout algorithm) |
| **Storage** | Supabase (cloud) + IndexedDB (local via idb-keyval) |
| **Language** | TypeScript 5.x |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd App-Arquitetura

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# Required for cloud storage
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for AI Discovery feature
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> **Note:** The `ANTHROPIC_API_KEY` is required for the AI Discovery feature. Without it, the "Start with AI" functionality will not work. Get your API key at [console.anthropic.com](https://console.anthropic.com/).

## Keyboard Shortcuts

### General Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save diagram |
| `Cmd/Ctrl + E` | Export diagram |
| `Cmd/Ctrl + D` | Duplicate selected |
| `Cmd/Ctrl + C` | Copy selected |
| `Cmd/Ctrl + X` | Cut selected |
| `Cmd/Ctrl + V` | Paste |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Delete/Backspace` | Delete selected |

### Drawing Tool Shortcuts

| Shortcut | Tool |
|----------|------|
| `V` | Select (move/select) |
| `P` | Pencil (freehand) |
| `A` | Arrow |
| `R` | Rectangle |
| `O` | Ellipse |
| `L` | Line |
| `D` | Toggle drawing mode |
| `C` | Toggle color picker |
| `Escape` | Exit current mode |

## Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Main page
├── components/
│   ├── flow/                # Flow diagram components
│   │   ├── FlowCanvas.tsx   # Main canvas orchestrator
│   │   ├── FlowToolbar.tsx  # Top toolbar with all controls
│   │   ├── DrawingOverlay.tsx # Shape & freehand drawing
│   │   ├── DrawingToolPicker.tsx # Tool selection dropdown
│   │   ├── BaseNode.tsx     # AI Architecture nodes
│   │   ├── FlowchartNode.tsx # Flowchart nodes
│   │   ├── GenericNode.tsx  # Brainstorming nodes
│   │   ├── ShapeNode.tsx    # Geometric shapes (with endpoint handles)
│   │   ├── StrokeNode.tsx   # Freehand drawings
│   │   ├── CustomEdge.tsx   # Custom edge with labels
│   │   ├── Sidebar.tsx      # Component library
│   │   └── ...
│   ├── discovery/           # AI Discovery components
│   │   ├── DiscoveryPanel.tsx    # Main discovery panel
│   │   ├── DiscoveryProgress.tsx # Dynamic progress bar
│   │   ├── DiscoverySummary.tsx  # Summary before generation
│   │   └── QuestionCard.tsx      # Q&A card component
│   └── ui/                  # shadcn/ui components
├── config/
│   ├── nodeTypes.ts         # AI Architecture node definitions
│   ├── flowchartNodeTypes.ts # Flowchart node definitions
│   ├── nodeCatalog.ts       # Sidebar categories + combined node catalog
│   ├── drawingTools.ts      # Drawing tool catalog + shortcuts
│   ├── nodeColors.ts        # Shared color palettes
│   ├── genericNode.ts       # Generic node icon catalog
│   ├── edgeStyles.ts        # Edge styles + label presets
│   ├── shortcuts.ts         # Keyboard shortcut catalog
│   └── templates.ts         # Pre-built diagram templates
├── hooks/
│   ├── diagrams/            # Diagram editing hooks
│   │   ├── useUndoRedo.ts
│   │   ├── useClipboard.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── storage/             # Storage/sync hooks
│   │   ├── useAutoSave.ts
│   │   └── useSyncStatus.ts
│   ├── drawing/             # Drawing/drag hooks
│   │   └── useDnD.tsx
│   ├── ai/                  # AI hooks
│   │   └── useAI.ts         # AI API calls with timeout
│   └── ...
├── types/
│   ├── flowNodes.ts         # Shared node data types
│   └── diagram.ts           # Diagram data models
├── store/
│   ├── flowStore.ts         # Main UI state (Zustand)
│   ├── discoveryStore.ts    # AI Discovery state
│   └── ...
├── lib/
│   ├── storage/             # IndexedDB + Supabase sync
│   │   ├── index.ts         # Diagram CRUD + sync
│   │   └── supabase.ts      # Supabase client
│   ├── ai/                  # AI integration
│   │   ├── client.ts        # Anthropic client (server-side)
│   │   └── prompts.ts       # Discovery and diagram prompts
│   └── diagram/             # Diagram export helpers
│       └── index.ts         # Export + auto-layout (dagre)
└── utils/
    ├── diagram/
    │   └── idGenerator.ts   # Node ID generation
    └── drawing/
        └── getSvgPathFromStroke.ts
```

## Templates

Available templates:

| Category | Templates |
|----------|-----------|
| **AI Agents** | Single Agent, Multi-Agent System, RAG Pipeline, RAG with Reranking, Customer Service Agent, Research Agent, Code Review Agent |
| **Flowchart** | Basic Flowchart, Decision Tree, Data Pipeline (ETL) |
| **General** | Blank Canvas |

## Documentation

For detailed documentation about how the project works, see [DOCS.md](./DOCS.md).

For AI assistants working on this codebase, see [CLAUDE.md](./CLAUDE.md).

## Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private.

## Acknowledgments

- [React Flow](https://reactflow.dev/) - Flow diagram library
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Supabase](https://supabase.com/) - Backend as a Service
- [perfect-freehand](https://github.com/steveruizok/perfect-freehand) - Freehand drawing
