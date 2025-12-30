# FlowMind

A hybrid visual diagram editor for brainstorming, flowcharts, AI agent architectures, and software systems. Create beautiful diagrams with an intuitive drag-and-drop interface and Excalidraw-style drawing tools.

![FlowMind](https://img.shields.io/badge/version-0.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

## Features

### Core Features
- **24+ Node Types** - Brainstorming, Flowchart, AI Agents, and Architecture nodes
- **Shape Drawing Tools** - Rectangle, Ellipse, Arrow, Line (Excalidraw-style)
- **Freehand Drawing** - Sketch annotations directly on the canvas
- **Auto-Save** - Local (IndexedDB) + Cloud (Supabase) synchronization
- **Undo/Redo** - Full history with 30 states
- **Multiple Diagrams** - Create, rename, duplicate, and delete diagrams

### Node Customization
- **Inline Color Picker** - Change node colors by clicking the color dot when selected
- **Inline Icon Picker** - 60+ icons for GenericNode (Free Node)
- **Editable Labels** - Click on any label to edit
- **Descriptions** - Add descriptions that appear on hover
- **Resizable** - Drag corners to resize nodes

### Drawing Tools
- **Select (V)** - Move and select elements
- **Pencil (P)** - Freehand drawing
- **Arrow (A)** - Draw arrows
- **Rectangle (R)** - Draw rectangles with connectable handles
- **Ellipse (O)** - Draw circles/ellipses with connectable handles
- **Line (L)** - Draw straight lines

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
- **Dark/Light Mode** - System theme support

### Export/Import
- **PNG Export** - High-resolution image export
- **SVG Export** - Vector format for scalability
- **JSON Export/Import** - Backup and share diagrams

## Node Types

| Category | Nodes | Description |
|----------|-------|-------------|
| **Brainstorming** | Free Node | Fully customizable - pick any icon (60+) and color |
| **Flowchart** | Start, End, Process, Decision, Data, I/O, Condition, Action, Result, User Action, System | Professional flowchart nodes with color variants |
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
| **Drawing** | perfect-freehand |
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
│   │   ├── ShapeNode.tsx    # Geometric shapes
│   │   ├── StrokeNode.tsx   # Freehand drawings
│   │   ├── CustomEdge.tsx   # Custom edge with labels
│   │   ├── Sidebar.tsx      # Component library
│   │   └── ...
│   └── ui/                  # shadcn/ui components
├── config/
│   ├── nodeTypes.ts         # AI Architecture node definitions
│   ├── flowchartNodeTypes.ts # Flowchart node definitions
│   ├── nodeCatalog.ts       # Sidebar categories + combined node catalog
│   ├── drawingTools.ts      # Drawing tool catalog + shortcuts
│   └── templates.ts         # Pre-built diagram templates
├── hooks/
│   ├── useAutoSave.ts       # Debounced auto-save logic
│   ├── useUndoRedo.ts       # Undo/redo with Zustand
│   ├── useClipboard.ts      # Copy/cut/paste operations
│   ├── useKeyboardShortcuts.ts # All keyboard handlers
│   └── ...
├── store/
│   ├── flowStore.ts         # Main UI state (Zustand)
│   └── ...
├── lib/
│   ├── storage.ts           # IndexedDB + Supabase sync
│   ├── export.ts            # PNG/SVG/JSON export
│   └── supabase.ts          # Supabase client
└── utils/
    └── idGenerator.ts       # Node ID generation
```

## Templates

Available templates:

| Category | Templates |
|----------|-----------|
| **AI Agents** | Single Agent, Multi-Agent System, RAG Pipeline |
| **Architecture** | Microservices, Serverless |
| **Flowchart** | Basic Flowchart, Decision Tree |
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
