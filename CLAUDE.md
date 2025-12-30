# AGENTS.md - AI Assistant Context

This file provides context for AI assistants working on the FlowMind codebase.

## Project Overview

FlowMind is a hybrid visual diagram editor built with Next.js 16, React 19, and @xyflow/react. It supports:

- **Brainstorming** - Free-form nodes with customizable icons and colors
- **Flowcharts** - Professional process diagrams
- **AI Agent Architecture** - Diagrams for AI systems
- **Software Architecture** - System design diagrams
- **Drawing** - Excalidraw-style shape tools

## Key Architecture Patterns

### 1. Node Type System

Nodes are categorized and rendered by different components:

| Node Type | Component | Config File |
|-----------|-----------|-------------|
| AI Architecture (agent, llm, tool, memory, input) | `BaseNode.tsx` | `nodeTypes.ts` |
| Flowchart (flowchart-*) | `FlowchartNode.tsx` | `flowchartNodeTypes.ts` |
| Brainstorming (generic) | `GenericNode.tsx` | N/A (self-contained) |
| Shapes (shape) | `ShapeNode.tsx` | N/A |
| Freehand (stroke) | `StrokeNode.tsx` | N/A |

### 2. State Management

Uses Zustand with Immer for immutable updates:

```
src/store/
├── flowStore.ts      # UI state (isDrawing, drawingTool, selectedColor, etc.)
├── undoRedoStore.ts  # History management
├── syncStatusStore.ts # Cloud sync status
└── clipboardStore.ts # Copy/paste state
```

**Important**: React Flow manages `nodes` and `edges` internally via `useNodesState` and `useEdgesState`. Don't try to put them in Zustand.

### 3. Drawing System

The drawing system uses a `drawingTool` state that determines behavior:

```typescript
type DrawingTool = 'select' | 'freehand' | 'arrow' | 'rectangle' | 'ellipse' | 'line';
```

- `DrawingOverlay.tsx` captures pointer events when drawing
- `DrawingToolPicker.tsx` provides the UI for tool selection
- Setting any tool except 'select' automatically enables `isDrawing`

### 4. Storage Architecture

Two-tier storage with offline-first approach:

1. **IndexedDB** (via idb-keyval) - Primary local storage
2. **Supabase** - Cloud sync for backup and cross-device access

Key functions in `lib/storage.ts`:
- `saveDiagramState()` - Save nodes/edges/viewport
- `loadDiagramState()` - Load diagram data
- `syncToCloud()` - Sync to Supabase

## Important Files

### Components

| File | Purpose |
|------|---------|
| `FlowCanvas.tsx` | Main orchestrator - handles all canvas logic |
| `FlowToolbar.tsx` | Top toolbar UI |
| `DrawingOverlay.tsx` | Captures drawing events, creates shapes |
| `Sidebar.tsx` | Component library with categories |
| `BaseNode.tsx` | Renders AI Architecture nodes |
| `FlowchartNode.tsx` | Renders flowchart nodes with variants |
| `GenericNode.tsx` | Fully customizable brainstorming node |
| `ShapeNode.tsx` | Geometric shapes (rect, ellipse, line, arrow) |
| `CustomEdge.tsx` | Edge with labels and style picker |

### Configuration

| File | Purpose |
|------|---------|
| `config/nodeTypes.ts` | AI Architecture node definitions |
| `config/flowchartNodeTypes.ts` | Flowchart node definitions with variants |
| `config/nodeCatalog.ts` | Sidebar categories + combined node catalog |
| `config/templates.ts` | Pre-built diagram templates |

### Hooks

| File | Purpose |
|------|---------|
| `useKeyboardShortcuts.ts` | All keyboard handlers |
| `useAutoSave.ts` | Debounced auto-save logic |
| `useUndoRedo.ts` | Undo/redo with snapshots |
| `useClipboard.ts` | Copy/cut/paste |
| `useDnD.ts` | Drag-and-drop context |

## Code Conventions

### TypeScript

- Use `NodeProps` from `@xyflow/react` for node components
- Cast `data` to specific type: `const nodeData = data as FlowchartNodeData;`
- Add index signature for React Flow compatibility: `[key: string]: unknown;`

### Component Structure

```typescript
const MyNode = ({ data, selected, id }: NodeProps) => {
  const nodeData = data as MyNodeData;
  const { setNodes } = useReactFlow();

  // Callbacks with useCallback
  const onLabelChange = useCallback(() => {
    setNodes((nds) => nds.map(/* ... */));
  }, [id, setNodes]);

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

### Zustand Store Pattern

```typescript
export const useFlowStore = create<FlowState>()(
  devtools(
    immer((set) => ({
      // State
      drawingTool: 'select' as DrawingTool,

      // Actions
      setDrawingTool: (tool) => set((state) => {
        state.drawingTool = tool;
        state.isDrawing = tool !== 'select';
      }),
    }))
  )
);

// Selectors for performance
export const useDrawingTool = () => useFlowStore((s) => s.drawingTool);
```

## Common Tasks

### Adding a New Node Type

1. Define config in appropriate file (`nodeTypes.ts` or `flowchartNodeTypes.ts`)
2. Create component if needed (or reuse existing)
3. Register in `FlowCanvas.tsx` nodeTypes memo
4. Add to `config/nodeCatalog.ts` categories

### Adding a New Drawing Tool

1. Add to `DrawingTool` type in `flowStore.ts`
2. Add icon and config to `DrawingToolPicker.tsx`
3. Handle in `DrawingOverlay.tsx` drawing logic
4. Add keyboard shortcut in `useKeyboardShortcuts.ts`

### Adding a New Template

Add to `config/templates.ts`:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  description: 'Description here',
  category: 'flowchart', // or 'ai-agents', 'architecture', 'general'
  nodes: [...],
  edges: [...],
}
```

## TypeScript Gotchas

### React Flow Node Data

React Flow requires node data to be compatible with `Record<string, unknown>`. Always add index signature:

```typescript
export interface MyNodeData {
  label: string;
  color?: string;
  // Required for React Flow compatibility
  [key: string]: unknown;
}
```

### NodeProps Generic

Don't use generic with NodeProps if you need to access `type`:

```typescript
// DON'T
const MyNode = ({ data }: NodeProps<MyNodeData>) => { ... }

// DO
const MyNode = ({ data, type }: NodeProps) => {
  const nodeData = data as MyNodeData;
  // Now you can use both `type` and `nodeData`
}
```

## Performance Tips

1. **Memoize components** - All node/edge components should use `memo()`
2. **Selective subscriptions** - Use specific selectors with Zustand
3. **Module-level constants** - Put static configs outside components
4. **Lazy loading** - Use dynamic imports for heavy libraries (html-to-image)

## Testing Changes

```bash
npm run build  # Check for TypeScript errors
npm run dev    # Test in development mode
```

The build must pass without errors before considering changes complete.

## UI Components

Uses shadcn/ui built on Radix UI. Components are in `src/components/ui/`. Common ones:

- `Button`, `Input` - Basic controls
- `Popover` - Floating content (color pickers, menus)
- `DropdownMenu` - Menu dropdowns
- `Dialog` - Modal dialogs
- `Tooltip` - Hover tooltips
- `ScrollArea` - Scrollable containers

## File Organization

```
src/
├── app/           # Next.js pages
├── components/
│   ├── flow/      # Diagram-specific components
│   └── ui/        # shadcn/ui components
├── config/        # Node types, templates
├── hooks/         # Custom React hooks
├── store/         # Zustand stores
├── lib/           # Utilities (storage, export, supabase)
└── utils/         # Small utilities
```
