# FlowMind - Documentacao Tecnica

Este documento explica a logica, arquitetura e funcionamento do FlowMind.

## Indice

1. [Visao Geral](#visao-geral)
2. [Tipos de Nodes](#tipos-de-nodes)
3. [Ferramentas de Desenho](#ferramentas-de-desenho)
4. [Fluxo do Usuario](#fluxo-do-usuario)
5. [Arquitetura de Componentes](#arquitetura-de-componentes)
6. [Gerenciamento de Estado](#gerenciamento-de-estado)
7. [Sistema de Storage](#sistema-de-storage)
8. [Funcionalidades Principais](#funcionalidades-principais)
9. [Sistema de Undo/Redo](#sistema-de-undoredo)
10. [Auto-Save](#auto-save)
11. [Exportacao](#exportacao)
12. [Atalhos de Teclado](#atalhos-de-teclado)

---

## Visao Geral

FlowMind e um editor visual de diagramas hibrido que suporta:

1. **Brainstorming Livre** - GenericNode totalmente customizavel (icone + cor + texto)
2. **Fluxogramas Profissionais** - 11 tipos de nodes de flowchart com variantes de cor
3. **Diagramas de Arquitetura de Software** - Frontend, Backend, Database, Cloud
4. **Diagramas de Agentes de IA** - Agent, LLM, Tool, Memory, Input
5. **Desenho de Formas** - Retangulos, elipses, linhas e setas conectaveis

O usuario pode arrastar componentes para o canvas, conecta-los com edges, desenhar formas geometricas, adicionar anotacoes a mao livre, e salvar/exportar seus diagramas.

### Fluxo Principal

```
+---------------+     +---------------+     +---------------+
|   Sidebar     |---->|   Canvas      |---->|   Storage     |
|  (Drag)       |     |  (Drop)       |     |  (Save)       |
+---------------+     +---------------+     +---------------+
                             |
                             v
                      +---------------+
                      |   Export      |
                      | (PNG/SVG)     |
                      +---------------+
```

---

## Tipos de Nodes

### Brainstorming (GenericNode)

Node totalmente customizavel para brainstorming livre:

| Recurso | Descricao |
|---------|-----------|
| **60+ icones** | Clique no icone para trocar |
| **18 cores** | Clique no circulo colorido quando selecionado |
| **Label editavel** | Clique no texto para editar |
| **Descricao** | Aparece no hover, clique para editar |
| **Handles** | 4 lados para conexoes |

Arquivo: `src/components/flow/GenericNode.tsx`
Catalogos: `src/config/genericNode.ts`, `src/config/nodeColors.ts`

### Flowchart Nodes

11 tipos pre-definidos com variantes de cor:

| Node | Variante | Cor | Uso |
|------|----------|-----|-----|
| `flowchart-start` | input | Verde | Inicio do fluxo |
| `flowchart-end` | output | Roxo | Fim do fluxo |
| `flowchart-process` | primary | Azul | Acao ou operacao |
| `flowchart-decision` | decision | Amarelo | Ponto de decisao (sim/nao) |
| `flowchart-data` | default | Cinza | Dados ou storage |
| `flowchart-io` | input | Verde | Input/output de usuario |
| `flowchart-condition` | decision | Amarelo | Condicao ou validacao |
| `flowchart-action` | primary | Azul | Tarefa a executar |
| `flowchart-result` | output | Roxo | Resultado ou outcome |
| `flowchart-user` | input | Verde | Acao de usuario |
| `flowchart-system` | default | Cinza | Processo de sistema |

Recursos:
- **Label e descricao editaveis** - clique para editar
- **Seletor de cor inline** - aparece quando selecionado
- **Redimensionavel** - arraste os cantos
- **Handles nos 4 lados**

Arquivos:
- Config: `src/config/flowchartNodeTypes.ts`
- Paleta: `src/config/nodeColors.ts`
- Componente: `src/components/flow/FlowchartNode.tsx`

### AI Agents Nodes

5 tipos para diagramas de agentes de IA:

| Node | Descricao |
|------|-----------|
| `agent` | Agente de IA |
| `llm` | Modelo de linguagem |
| `tool` | Ferramenta externa |
| `memory` | Memoria (vector DB, history) |
| `input` | Input do usuario |

### Architecture Nodes

4 tipos para arquitetura de software:

| Node | Descricao |
|------|-----------|
| `frontend` | Aplicacao frontend |
| `backend` | API ou servidor |
| `database` | Banco de dados |
| `cloud` | Servico de cloud |

### General Nodes

3 tipos de uso geral:

| Node | Descricao |
|------|-----------|
| `user` | Usuario/ator |
| `note` | Nota ou comentario |
| `container` | Agrupador visual |

Catalogo e categorias do Sidebar ficam centralizados em:
- `src/config/nodeCatalog.ts`

---

## Ferramentas de Desenho

### Drawing Tool Picker

Dropdown com 6 ferramentas:

| Ferramenta | Atalho | Descricao |
|------------|--------|-----------|
| Select | `V` | Mover e selecionar elementos |
| Freehand | `P` | Desenho livre a mao |
| Arrow | `A` | Desenhar setas |
| Rectangle | `R` | Desenhar retangulos |
| Ellipse | `O` | Desenhar circulos/elipses |
| Line | `L` | Desenhar linhas retas |

Arquivo: `src/components/flow/DrawingToolPicker.tsx`
Config: `src/config/drawingTools.ts`

### ShapeNodes (Formas Geometricas)

Retangulos e elipses desenhados agora tem:

| Recurso | Descricao |
|---------|-----------|
| **Handles** | 4 lados (aparecem no hover) - conectaveis com edges |
| **Seletor de cor** | Aparece quando selecionado |
| **Toggle de fill** | F = preenchido, O = outline |
| **Redimensionavel** | Arraste os cantos |

Arquivo: `src/components/flow/ShapeNode.tsx`
Paleta: `src/config/nodeColors.ts`

### StrokeNode (Desenho Livre)

Para desenhos a mao livre usando perfect-freehand:

Arquivo: `src/components/flow/StrokeNode.tsx`

---

## Fluxo do Usuario

### 1. Primeiro Acesso

1. Sistema verifica se existe diagrama salvo (IndexedDB)
2. Se nao existe, executa migracao de dados legados
3. Se nao ha dados legados, cria um diagrama vazio "My First Diagram"
4. Exibe tour de onboarding (apenas na primeira vez)

### 2. Criando um Diagrama

1. Usuario arrasta componente da Sidebar
2. Solta no Canvas na posicao desejada
3. Um novo node e criado com ID unico
4. Contador de mudancas (dirtyCounter) e incrementado
5. Auto-save dispara apos 2 segundos de inatividade

### 3. Conectando Componentes

1. Usuario clica no handle de saida de um node
2. Arrasta ate o handle de entrada de outro node
3. Uma edge e criada com estilo padrao (bezier)
4. Usuario pode customizar estilo, cor e label da edge

### 4. Modo Desenho de Formas

1. Usuario clica no dropdown de ferramentas ou usa atalho (R, O, A, L)
2. Canvas entra em modo de desenho
3. Usuario clica e arrasta para criar a forma
4. Ao soltar, um ShapeNode e criado
5. ShapeNodes de retangulo/elipse podem ser conectados via handles

### 5. Customizando Nodes

1. **Editar texto**: Clique no label ou descricao
2. **Mudar cor**: Selecione o node, clique no circulo colorido
3. **Mudar icone** (GenericNode): Clique no icone
4. **Redimensionar**: Arraste os handles de canto

### 6. Salvando

- **Auto-save**: Dispara 2 segundos apos ultima mudanca
- **Manual**: Cmd+S ou botao Save
- Primeiro salva no IndexedDB (local)
- Depois sincroniza com Supabase (cloud)
- Indicador mostra status: idle -> syncing -> synced/error
- Nome do diagrama mostra ponto quando ha mudancas nao salvas

---

## Arquitetura de Componentes

### Hierarquia Principal

```
FlowCanvas (Orquestrador)
|-- FlowToolbar (Barra de ferramentas)
|   |-- DiagramManager (Seletor de diagramas)
|   |-- Undo/Redo buttons
|   |-- ColorPicker
|   |-- DrawingToolPicker (NOVO)
|   |-- TemplateGallery
|   |-- ExportMenu
|   |-- HelpDialog
|-- DrawingOverlay (Captura eventos de desenho)
|-- ReactFlow (Canvas principal)
|   |-- BaseNode (AI Architecture nodes)
|   |-- FlowchartNode (Flowchart nodes) (NOVO)
|   |-- GenericNode (Brainstorming nodes) (NOVO)
|   |-- ShapeNode (Formas geometricas) (NOVO)
|   |-- StrokeNode (Desenhos a mao)
|   |-- CustomEdge (Conexoes com labels)
|   |-- Background (Grid de pontos)
|   |-- MiniMap
|   |-- ZoomControls
|-- Sidebar (Biblioteca de componentes)
```

### Responsabilidades

| Componente | Responsabilidade |
|------------|------------------|
| **FlowCanvas** | Orquestra estado, handlers, e renderizacao do canvas |
| **FlowToolbar** | UI da toolbar, delega acoes para FlowCanvas |
| **DrawingOverlay** | Captura pointer events para modo desenho |
| **DrawingToolPicker** | Dropdown para selecao de ferramenta de desenho |
| **BaseNode** | Renderiza nodes de AI Architecture |
| **FlowchartNode** | Renderiza nodes de flowchart com variantes |
| **GenericNode** | Node totalmente customizavel para brainstorming |
| **ShapeNode** | Renderiza formas geometricas (rect, ellipse, line, arrow) |
| **StrokeNode** | Renderiza desenhos a mao livre |
| **CustomEdge** | Renderiza edges com estilos e labels customizados |
| **Sidebar** | Lista componentes arrastaveis por categoria |
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
  drawingTool: DrawingTool;  // select | freehand | arrow | rectangle | ellipse | line
  selectedColor: string;     // Cor selecionada
  colorPickerOpen: boolean;  // Color picker aberto
  snapToGrid: boolean;       // Snap to grid ativo
  dirtyCounter: number;      // Contador de mudancas (isDirty = dirtyCounter > 0)

  // Diagram Metadata
  currentDiagramId: string | null;
  currentDiagramName: string;
}

type DrawingTool = 'select' | 'freehand' | 'arrow' | 'rectangle' | 'ellipse' | 'line';
```

#### 2. undoRedoStore

```typescript
interface UndoRedoState {
  past: Snapshot[];    // Historico de estados anteriores (max 30)
  future: Snapshot[];  // Estados para redo
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

1. **Subscriptions Seletivas** - Componentes so re-renderizam quando seu slice muda
2. **Sem Providers** - Nao precisa de context wrapper
3. **Actions Estaveis** - Funcoes nao sao recriadas a cada render
4. **DevTools** - Integracao com Redux DevTools
5. **Immer** - Atualizacoes imutaveis simplificadas

---

## Sistema de Storage

### Arquitetura de Dados

```
+-----------------------------------------------------+
|                     storage/                         |
+-----------------------------------------------------+
|                                                      |
|  +-------------+         +---------------------+     |
|  |  IndexedDB  |<------->|   In-Memory Cache   |     |
|  |  (idb-keyval)|         |   (diagramsCache)   |     |
|  +-------------+         +---------------------+     |
|         |                                            |
|         | (depois de salvar localmente)              |
|         v                                            |
|  +-------------+                                     |
|  |  Supabase   |                                     |
|  |  (cloud)    |                                     |
|  +-------------+                                     |
|                                                      |
+-----------------------------------------------------+
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
  viewport: Viewport; // Posicao e zoom do canvas
  updatedAt: number;
}
```

---

## Funcionalidades Principais

### Drag and Drop

1. **Sidebar** define o tipo via `useDnD` context
2. **FlowCanvas** captura `onDrop` event
3. Converte coordenadas de tela para coordenadas do flow
4. Cria node com `generateNodeId()` e posicao calculada

### Modo Desenho de Formas

1. Ativa via atalho (R, O, A, L) ou dropdown
2. DrawingOverlay captura pointer events
3. Mostra preview da forma durante o arrasto
4. Ao soltar, cria ShapeNode com dimensoes calculadas

### Templates

Templates sao definidos em `config/templates.ts`:

```typescript
interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  category: 'ai-agents' | 'architecture' | 'flowchart' | 'general';
  nodes: Node[];
  edges: Edge[];
}
```

Templates disponiveis:
- **AI Agents**: Single Agent, Multi-Agent System, RAG Pipeline
- **Architecture**: Microservices, Serverless
- **Flowchart**: Basic Flowchart, Decision Tree
- **General**: Blank Canvas

---

## Sistema de Undo/Redo

### Como Funciona

```
Past: [S1, S2, S3]  <-  Historico
Current: S4         <-  Estado atual (nodes + edges)
Future: []          <-  Estados para redo
```

### Quando Salvar Snapshot

- Antes de adicionar node (drop, paste)
- Antes de deletar node/edge
- Antes de mover node (drag start)
- Antes de conectar nodes
- Antes de mudar cor
- Antes de desenhar forma
- Antes de aplicar template

### Limite de Historico

Maximo de 30 estados para evitar consumo excessivo de memoria.

---

## Auto-Save

### Logica de Debouncing

```
[Mudanca] -> [Espera 2s] -> [Verifica dirtyCounter>0] -> [Salva]
                ^
        [Nova mudanca cancela timer anterior]
```

### Eventos que Disparam Save

1. **Debounced (2s)** - Apos qualquer mudanca com dirtyCounter>0
2. **Periodico (60s)** - Verifica e salva se dirtyCounter>0
3. **Visibility Change** - Salva imediatamente ao mudar de aba
4. **Manual** - Cmd+S ou botao Save

---

## Exportacao

### PNG Export

1. Calcula bounds de todos os nodes
2. Calcula viewport para enquadrar todo o conteudo
3. Lazy load de `html-to-image`
4. Gera PNG em alta resolucao (2x)
5. Download automatico

### SVG Export

Similar ao PNG, mas gera SVG vetorial.

### JSON Export/Import

Exporta/importa estado completo:
```typescript
{
  nodes: [...],
  edges: [...],
  viewport: { x, y, zoom }
}
```

---

## Atalhos de Teclado

Config central: `src/config/shortcuts.ts`

### Atalhos Gerais (Cmd/Ctrl + tecla)

| Atalho | Acao |
|--------|------|
| `Cmd+S` | Salvar diagrama |
| `Cmd+E` | Exportar diagrama |
| `Cmd+D` | Duplicar selecionados |
| `Cmd+C` | Copiar selecionados |
| `Cmd+X` | Recortar selecionados |
| `Cmd+V` | Colar |
| `Cmd+Z` | Desfazer |
| `Cmd+Shift+Z` | Refazer |

### Atalhos de Ferramentas de Desenho

| Atalho | Ferramenta |
|--------|------------|
| `V` | Select (mover/selecionar) |
| `P` | Pencil (desenho livre) |
| `A` | Arrow (setas) |
| `R` | Rectangle (retangulos) |
| `O` | Ellipse (circulos/elipses) |
| `L` | Line (linhas retas) |

### Outros Atalhos

| Atalho | Acao |
|--------|------|
| `D` | Toggle modo desenho |
| `C` | Toggle color picker |
| `Escape` | Sair do modo atual |
| `Delete/Backspace` | Deletar selecionados |

---

## Performance

### Otimizacoes Implementadas

1. **Zustand com Immer** - Atualizacoes imutaveis eficientes
2. **Selective Subscriptions** - Componentes so re-renderizam quando seu slice muda
3. **useMemo/useCallback** - Evita recriacao de objetos e funcoes
4. **memo()** - Componentes memoizados (BaseNode, FlowchartNode, GenericNode, etc.)
5. **Module-level Constants** - Objetos estaticos fora dos componentes
6. **Lazy Loading** - html-to-image carregado apenas quando necessario
7. **In-memory Cache** - Cache de diagrams list para evitar leituras de IndexedDB
8. **Debounced Auto-save** - Evita saves excessivos

---

## Decisoes de Design

### Por que React Flow?

- Biblioteca madura e bem mantida
- Suporte nativo a drag-and-drop
- Handles de conexao
- Minimap e controles de zoom
- Extensivel com tipos customizados

### Por que Zustand em vez de Context?

- Performance: subscriptions seletivas
- Simplicidade: sem providers
- DevTools: debugging facilitado
- Estabilidade: actions nao mudam referencia

### Por que IndexedDB + Supabase?

- **IndexedDB**: Offline-first, rapido, sem limite de 5MB
- **Supabase**: Sync entre dispositivos, backup na nuvem

### Por que criar FlowchartNode separado de BaseNode?

- **FlowchartNode** tem variantes de cor pre-definidas e visual diferente
- **BaseNode** e mais generico para AI Architecture
- Separacao permite customizacao independente
