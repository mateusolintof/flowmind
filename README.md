# FlowMind

A visual diagram editor for AI agent architectures and software systems. Create beautiful flowcharts and architecture diagrams with an intuitive drag-and-drop interface.

![FlowMind](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)

## Features

### Core Features
- **Drag & Drop Components** - 13 node types for AI agents and architecture diagrams
- **Freehand Drawing** - Sketch annotations directly on the canvas
- **Auto-Save** - Local (IndexedDB) + Cloud (Supabase) synchronization
- **Undo/Redo** - Full history with 50 states

### Productivity
- **Keyboard Shortcuts** - Cmd+S (save), Cmd+E (export), Cmd+D (duplicate), Cmd+C/X/V (copy/cut/paste), Cmd+Z (undo)
- **Templates** - Pre-built diagrams for common patterns (Single Agent, Multi-Agent, RAG, Microservices)
- **Snap to Grid** - Align components precisely
- **Copy/Paste** - Duplicate nodes with their connections

### Visual/UX
- **Custom Edge Styles** - Bezier, Step, Straight lines with colors and labels
- **Color Customization** - Apply colors to nodes and edges
- **Zoom Controls** - Visual zoom in/out with percentage display
- **Responsive Design** - Works on desktop and mobile
- **Dark/Light Mode** - System theme support

### Export/Import
- **PNG Export** - High-resolution image export
- **SVG Export** - Vector format for scalability
- **JSON Export/Import** - Backup and share diagrams

### Learning
- **Interactive Onboarding** - Guided tour for new users
- **Diagram Guide** - Best practices for Frontend, Backend, Fullstack, AI Agents, and Multi-Agent systems

## Node Types

| Category | Nodes |
|----------|-------|
| AI Agents | Agent, LLM, Tool, Memory, Input |
| Architecture | Frontend, Backend, Database, Cloud |
| General | User, Note, Container |

## Tech Stack

- **Framework:** Next.js 16.1.1 with React 19
- **Flow Library:** @xyflow/react 12.10
- **Styling:** Tailwind CSS 4, Radix UI, shadcn/ui
- **Storage:** Supabase (cloud) + IndexedDB (local)
- **Language:** TypeScript

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
├── app/                    # Next.js app router
├── components/
│   ├── flow/              # Flow diagram components
│   │   ├── FlowCanvas.tsx # Main canvas component
│   │   ├── BaseNode.tsx   # Node renderer
│   │   ├── Sidebar.tsx    # Component library
│   │   └── ...
│   └── ui/                # shadcn/ui components
├── config/
│   ├── nodeTypes.ts       # Node definitions
│   └── templates.ts       # Diagram templates
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and storage
└── styles/                # Global styles
```

## Scripts

```bash
npm run dev      # Start development server
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

- [React Flow](https://reactflow.dev/) for the flow diagram library
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
