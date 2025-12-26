# FlowMind - Documentação Técnica

Este documento explica a lógica, arquitetura e funcionamento do FlowMind.

## Índice

1. [Visão Geral](#visão-geral)
2. [Fluxo do Usuário](#fluxo-do-usuário)
3. [Arquitetura de Componentes](#arquitetura-de-componentes)
4. [Gerenciamento de Estado](#gerenciamento-de-estado)
5. [Sistema de Storage](#sistema-de-storage)
6. [Funcionalidades Principais](#funcionalidades-principais)
7. [Sistema de Undo/Redo](#sistema-de-undoredo)
8. [Auto-Save](#auto-save)
9. [Exportação](#exportação)

---

## Visão Geral

FlowMind é um editor visual de diagramas focado em dois casos de uso:

1. **Diagramas de Arquitetura de Software** - Frontend, Backend, Database, Cloud
2. **Diagramas de Agentes de IA** - Agent, LLM, Tool, Memory, Input

O usuário pode arrastar componentes para o canvas, conectá-los com edges, adicionar anotações desenhadas à mão, e salvar/exportar seus diagramas.

### Fluxo Principal

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sidebar   │────▶│   Canvas    │────▶│   Storage   │
│  (Drag)     │     │  (Drop)     │     │  (Save)     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Export    │
                    │ (PNG/SVG)   │
                    └─────────────┘
```

---

## Fluxo do Usuário

### 1. Primeiro Acesso

1. Sistema verifica se existe diagrama salvo (IndexedDB)
2. Se não existe, executa migração de dados legados
3. Se não há dados legados, cria um diagrama vazio "My First Diagram"
4. Exibe tour de onboarding (apenas na primeira vez)

### 2. Criando um Diagrama

1. Usuário arrasta componente da Sidebar
2. Solta no Canvas na posição desejada
3. Um novo node é criado com ID único
4. Estado é marcado como "dirty" (não salvo)
5. Auto-save dispara após 2 segundos de inatividade

### 3. Conectando Componentes

1. Usuário clica no handle de saída de um node
2. Arrasta até o handle de entrada de outro node
3. Uma edge é criada com estilo padrão (bezier)
4. Usuário pode customizar estilo, cor e label da edge

### 4. Modo Desenho

1. Usuário pressiona `D` ou clica no botão de desenho
2. Canvas entra em modo de desenho (ponteiro muda para crosshair)
3. Usuário desenha com o mouse/touch
4. Ao soltar, um StrokeNode é criado com os pontos do desenho
5. O desenho pode ser movido e deletado como qualquer node

### 5. Salvando

- **Auto-save**: Dispara 2 segundos após última mudança
- **Manual**: Cmd+S ou botão Save
- Primeiro salva no IndexedDB (local)
- Depois sincroniza com Supabase (cloud)
- Indicador mostra status: idle → syncing → synced/error

---

## Arquitetura de Componentes

### Hierarquia Principal

```
FlowCanvas (Orquestrador)
├── FlowToolbar (Barra de ferramentas)
│   ├── DiagramManager (Seletor de diagramas)
│   ├── Undo/Redo buttons
│   ├── ColorPicker
│   ├── Drawing toggle
│   ├── TemplateGallery
│   ├── ExportMenu
│   └── HelpDialog
├── DrawingOverlay (Captura eventos de desenho)
├── ReactFlow (Canvas principal)
│   ├── BaseNode (Renderiza todos os tipos de node)
│   ├── StrokeNode (Renderiza desenhos)
│   ├── CustomEdge (Renderiza conexões)
│   ├── Background (Grid de pontos)
│   ├── MiniMap
│   └── ZoomControls
└── Sidebar (Biblioteca de componentes)
```

### Responsabilidades

| Componente | Responsabilidade |
|------------|------------------|
| **FlowCanvas** | Orquestra estado, handlers, e renderização do canvas |
| **FlowToolbar** | UI da toolbar, delega ações para FlowCanvas |
| **DrawingOverlay** | Captura pointer events para modo desenho |
| **BaseNode** | Renderiza qualquer tipo de node (agent, llm, etc.) |
| **CustomEdge** | Renderiza edges com estilos customizados |
| **Sidebar** | Lista componentes arrastáveis por categoria |
| **DiagramManager** | CRUD de diagramas (criar, renomear, deletar) |

---

## Gerenciamento de Estado

### Zustand Stores

O projeto usa Zustand para gerenciamento de estado global:

#### 1. flowStore (Principal)

```typescript
interface FlowState {
  // UI State
  isDrawing: boolean;        // Modo desenho ativo
  selectedColor: string;     // Cor selecionada
  colorPickerOpen: boolean;  // Color picker aberto
  snapToGrid: boolean;       // Snap to grid ativo
  isDirty: boolean;          // Há mudanças não salvas

  // Diagram Metadata
  currentDiagramId: string | null;
  currentDiagramName: string;
}
```

#### 2. undoRedoStore

```typescript
interface UndoRedoState {
  past: Snapshot[];    // Histórico de estados anteriores (max 30)
  future: Snapshot[];  // Estados para redo
}

interface Snapshot {
  nodes: Node[];
  edges: Edge[];
}
```

#### 3. syncStatusStore

```typescript
type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
```

#### 4. clipboardStore

```typescript
interface ClipboardState {
  nodes: Node[];      // Nodes copiados
  edges: Edge[];      // Edges copiados
  hasContent: boolean;
}
```

### Por que Zustand?

1. **Subscriptions Seletivas** - Componentes só re-renderizam quando seu slice muda
2. **Sem Providers** - Não precisa de context wrapper
3. **Actions Estáveis** - Funções não são recriadas a cada render
4. **DevTools** - Integração com Redux DevTools
5. **Immer** - Atualizações imutáveis simplificadas

### Estado Local vs Global

| Estado | Onde | Por quê |
|--------|------|---------|
| nodes, edges | React Flow hooks | React Flow requer controle interno |
| isDrawing, selectedColor | Zustand | Compartilhado entre FlowToolbar e DrawingOverlay |
| currentStroke | DrawingOverlay local | Só usado durante desenho |
| colorPickerOpen | Zustand | Controlado por keyboard shortcut |

---

## Sistema de Storage

### Arquitetura de Dados

```
┌─────────────────────────────────────────────────────┐
│                     storage.ts                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────┐         ┌─────────────────────┐   │
│  │  IndexedDB  │◄───────▶│   In-Memory Cache   │   │
│  │  (idb-keyval)│         │   (diagramsCache)   │   │
│  └─────────────┘         └─────────────────────┘   │
│         │                                           │
│         │ (depois de salvar localmente)             │
│         ▼                                           │
│  ┌─────────────┐                                   │
│  │  Supabase   │                                   │
│  │  (cloud)    │                                   │
│  └─────────────┘                                   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Estrutura de Dados

#### Diagram (metadata)
```typescript
interface Diagram {
  id: string;        // UUID
  name: string;      // Nome do diagrama
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}
```

#### FlowState (dados do diagrama)
```typescript
interface FlowState {
  nodes: Node[];     // Nodes do React Flow
  edges: Edge[];     // Edges do React Flow
  viewport: Viewport; // Posição e zoom do canvas
  updatedAt: number;
}
```

### Chaves no IndexedDB

| Chave | Conteúdo |
|-------|----------|
| `flowmind-diagrams-list` | Array de Diagram (metadata) |
| `flowmind-diagram-{id}` | FlowState do diagrama |
| `flowmind-current-diagram` | ID do diagrama atual (localStorage) |
| `flowmind-user-id` | ID anônimo do usuário (localStorage) |

### Cache em Memória

Para evitar leituras repetidas do IndexedDB:

```typescript
let diagramsCache: Diagram[] | null = null;

// Ao ler
if (diagramsCache !== null) {
  return diagramsCache;  // Retorna do cache
}
const diagrams = await get(DIAGRAMS_LIST_KEY);
diagramsCache = diagrams ?? [];
return diagramsCache;

// Ao escrever
diagramsCache = diagrams;  // Atualiza cache
await set(DIAGRAMS_LIST_KEY, diagrams);
```

### Sincronização com Supabase

1. Primeiro salva no IndexedDB (rápido, offline-first)
2. Depois tenta sincronizar com Supabase
3. Usa `upsert` com constraint `(user_id, diagram_id)`
4. Se offline, marca status como 'offline'
5. Se erro, marca como 'error'
6. Se sucesso, marca como 'synced' por 3 segundos

---

## Funcionalidades Principais

### Drag and Drop

1. **Sidebar** define o tipo via `useDnD` context
2. **FlowCanvas** captura `onDrop` event
3. Converte coordenadas de tela para coordenadas do flow
4. Cria node com `generateNodeId()` e posição calculada

```typescript
const onDrop = (event: React.DragEvent) => {
  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  const newNode = {
    id: generateNodeId(),
    type,
    position,
    data: { label, color: selectedColor },
  };

  setNodes((nds) => nds.concat(newNode));
};
```

### Modo Desenho

1. Ativa via `D` ou botão na toolbar
2. DrawingOverlay captura pointer events
3. Acumula pontos em `currentStroke`
4. Ao soltar, cria StrokeNode com pontos relativos

```typescript
const onPointerUp = () => {
  // Calcula bounds do desenho
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  // Converte para pontos relativos
  const relativePoints = points.map(([px, py, pr]) =>
    [px - minX, py - minY, pr]
  );

  // Cria node de desenho
  const newNode = {
    id: generateNodeId(),
    type: 'stroke',
    position: { x: minX, y: minY },
    data: { points: relativePoints, color: selectedColor },
  };
};
```

### Templates

Templates são definidos em `config/templates.ts`:

```typescript
interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  category: 'ai-agents' | 'architecture' | 'general';
  nodes: Node[];
  edges: Edge[];
}
```

Ao selecionar um template:
1. Faz snapshot do estado atual (undo)
2. Substitui nodes e edges pelos do template
3. Reseta o ID counter baseado nos nodes do template

---

## Sistema de Undo/Redo

### Como Funciona

```
Past: [S1, S2, S3]  ←  Histórico
Current: S4         ←  Estado atual (nodes + edges)
Future: []          ←  Estados para redo
```

**Undo:**
```
Past: [S1, S2]
Current: S3
Future: [S4]
```

**Redo:**
```
Past: [S1, S2, S3]
Current: S4
Future: []
```

### Quando Salvar Snapshot

- Antes de adicionar node (drop, paste)
- Antes de deletar node/edge
- Antes de mover node (drag start)
- Antes de conectar nodes
- Antes de mudar cor
- Antes de desenhar
- Antes de aplicar template

### Limite de Histórico

Máximo de 30 estados para evitar consumo excessivo de memória.

```typescript
const MAX_HISTORY = 30;

takeSnapshot: (nodes, edges) => set((state) => {
  const snapshot = structuredClone({ nodes, edges });
  state.past = [...state.past.slice(-MAX_HISTORY + 1), snapshot];
  state.future = []; // Limpa redo ao fazer nova ação
}),
```

---

## Auto-Save

### Lógica de Debouncing

```
[Mudança] → [Espera 2s] → [Verifica isDirty] → [Salva]
                ↑
        [Nova mudança cancela timer anterior]
```

### Change Detection

Usa hash simples para detectar se houve mudança real:

```typescript
const computeHash = () => {
  const nodes = getNodes();
  const edges = getEdges();
  const viewport = getViewport();
  return `${nodes.length}-${edges.length}-${viewport.x.toFixed(1)}-${viewport.y.toFixed(1)}`;
};
```

Se o hash for igual ao último save, não salva novamente.

### Eventos que Disparam Save

1. **Debounced (2s)** - Após qualquer mudança com isDirty=true
2. **Periódico (60s)** - Verifica e salva se isDirty=true
3. **Visibility Change** - Salva imediatamente ao mudar de aba
4. **Manual** - Cmd+S ou botão Save

---

## Exportação

### PNG Export

1. Calcula bounds de todos os nodes
2. Calcula viewport para enquadrar todo o conteúdo
3. Lazy load de `html-to-image`
4. Gera PNG em alta resolução (2x)
5. Download automático

### SVG Export

Similar ao PNG, mas gera SVG vetorial.

### JSON Export

Exporta estado completo:
```typescript
{
  nodes: [...],
  edges: [...],
  viewport: { x, y, zoom }
}
```

### JSON Import

1. Faz snapshot (undo)
2. Substitui nodes, edges, viewport
3. Reseta ID counter

---

## Performance

### Otimizações Implementadas

1. **Zustand com Immer** - Atualizações imutáveis eficientes
2. **Selective Subscriptions** - Componentes só re-renderizam quando seu slice muda
3. **useMemo/useCallback** - Evita recriação de objetos e funções
4. **memo()** - Componentes memoizados (BaseNode, CustomEdge, Sidebar, etc.)
5. **Module-level Constants** - Objetos estáticos fora dos componentes
6. **Lazy Loading** - html-to-image carregado apenas quando necessário
7. **In-memory Cache** - Cache de diagrams list para evitar leituras de IndexedDB
8. **Debounced Auto-save** - Evita saves excessivos
9. **Batch Writes** - Promise.all para escritas paralelas

### Métricas

- FlowCanvas.tsx: 818 → 468 linhas (-43%)
- Undo/redo history: 50 → 30 estados (menos memória)
- Auto-save interval: 30s → 60s (menos I/O)
- Debounce: 0 → 2s (menos saves)

---

## Decisões de Design

### Por que React Flow?

- Biblioteca madura e bem mantida
- Suporte nativo a drag-and-drop
- Handles de conexão
- Minimap e controles de zoom
- Extensível com tipos customizados

### Por que Zustand em vez de Context?

- Performance: subscriptions seletivas
- Simplicidade: sem providers
- DevTools: debugging facilitado
- Estabilidade: actions não mudam referência

### Por que IndexedDB + Supabase?

- **IndexedDB**: Offline-first, rápido, sem limite de 5MB
- **Supabase**: Sync entre dispositivos, backup na nuvem

### Por que não usar o flowStore para nodes/edges?

React Flow requer controle interno dos nodes/edges para funcionar corretamente. O flowStore é usado para UI state que precisa ser compartilhado entre componentes.
