# FlowMind

A visual diagram editor for AI agent architectures and software systems. Create beautiful flowcharts and architecture diagrams with an intuitive drag-and-drop interface.

![FlowMind](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

## Features

### Core Features
- **Drag & Drop Components** - 12 node types for AI agents and architecture diagrams
- **Freehand Drawing** - Sketch annotations directly on the canvas
- **Auto-Save** - Local (IndexedDB) + Cloud (Supabase) synchronization with debouncing
- **Undo/Redo** - Full history with 30 states
- **Multiple Diagrams** - Create, rename, duplicate, and delete diagrams

### Productivity
- **Keyboard Shortcuts** - Full keyboard support (see table below)
- **Templates** - Pre-built diagrams for common patterns (Single Agent, Multi-Agent, RAG, Microservices)
- **Snap to Grid** - Align components precisely
- **Copy/Paste** - Duplicate nodes with their connections

### Visual/UX
- **Custom Edge Styles** - Bezier, Step, Straight lines with colors and labels
- **Color Customization** - Apply colors to nodes and edges
- **Zoom Controls** - Visual zoom in/out with percentage display
- **Responsive Design** - Works on desktop and mobile with collapsible sidebar
- **Dark/Light Mode** - System theme support

### Export/Import
- **PNG Export** - High-resolution image export
- **SVG Export** - Vector format for scalability
- **JSON Export/Import** - Backup and share diagrams

### Learning
- **Interactive Onboarding** - Guided tour for new users
- **Diagram Guide** - Best practices for Frontend, Backend, Fullstack, AI Agents, and Multi-Agent systems

## Node Types

| Category | Nodes | Description |
|----------|-------|-------------|
| **AI Agents** | Agent, LLM, Tool, Memory, Input | Components for building AI agent systems |
| **Architecture** | Frontend, Backend, Database, Cloud | Software architecture components |
| **General** | User, Note, Container | General-purpose diagram elements |

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.1 with App Router |
| **UI Library** | React 19 |
| **Flow Library** | @xyflow/react 12.10 |
| **State Management** | Zustand with Immer |
| **Styling** | Tailwind CSS 4, Radix UI, shadcn/ui |
| **Animations** | Framer Motion |
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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Keyboard Shortcuts

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
| `D` | Toggle drawing mode |
| `C` | Toggle color picker |
| `Escape` | Exit current mode |
| `Delete/Backspace` | Delete selected |

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
│   │   ├── DrawingOverlay.tsx # Freehand drawing handler
│   │   ├── BaseNode.tsx     # Generic node renderer
│   │   ├── CustomEdge.tsx   # Custom edge with labels
│   │   ├── Sidebar.tsx      # Component library
│   │   ├── DiagramManager.tsx # Diagram CRUD operations
│   │   └── ...
│   └── ui/                  # shadcn/ui components
├── config/
│   ├── nodeTypes.ts         # Node type definitions with icons
│   └── templates.ts         # Pre-built diagram templates
├── hooks/
│   ├── useAutoSave.ts       # Debounced auto-save logic
│   ├── useUndoRedo.ts       # Undo/redo with Zustand
│   ├── useClipboard.ts      # Copy/cut/paste operations
│   ├── useKeyboardShortcuts.ts # All keyboard handlers
│   └── ...
├── store/
│   ├── flowStore.ts         # Main UI state (Zustand)
│   ├── undoRedoStore.ts     # History state
│   ├── syncStatusStore.ts   # Cloud sync status
│   └── clipboardStore.ts    # Clipboard state
├── lib/
│   ├── storage.ts           # IndexedDB + Supabase sync
│   ├── export.ts            # PNG/SVG/JSON export
│   └── supabase.ts          # Supabase client
├── utils/
│   └── idGenerator.ts       # Node ID generation
└── styles/                  # Global styles
```

## Documentation

For detailed documentation about how the project works, see [DOCS.md](./DOCS.md).

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
