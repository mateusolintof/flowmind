# FlowMind - Roadmap de Evolução Estratégica

## Visão Geral

**Posicionamento:** FlowMind - O parceiro de pensamento visual para arquitetos de sistemas de IA

**Diferencial:** O único lugar onde você descreve seu objetivo, é guiado por perguntas estruturadas, e tem o diagrama gerado automaticamente.

**Público-alvo:**
- Desenvolvedores iniciantes em IA
- Consultores que planejam soluções para clientes
- Empresas pequenas entrando em IA sem equipe técnica
- Educadores ensinando arquitetura de sistemas

---

## Decisões Estratégicas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| LLM Strategy | v1: Anthropic API → v2: LLM Local | Rápido para MVP, sem custos recorrentes depois |
| Prioridade | AI Discovery Flow | Diferencial real vs. Miro + ChatGPT |
| Tipo de perguntas | Dinâmicas | Evita ser genérico, personaliza para cada projeto |
| Napkin-style | P2 (complementar) | Útil para TDAH + pesquisa, mas não é core |

---

## Milestone 0: Bug Fixes Pendentes
**Objetivo:** Corrigir problemas identificados antes de adicionar novas features.
**Prioridade:** P0 (Crítico)
**Status:** ⬜ Não iniciado

### 0.1 Fix Templates Viewport
- [ ] **Adicionar fitView após carregar template**

  **Problema:** Quando usuário seleciona um template, os nodes são carregados mas o viewport não ajusta, fazendo parecer que nada aconteceu ("templates quebrados").

  **Causa raiz:** `handleSelectTemplate()` em FlowCanvas.tsx não chama `fitView()` após carregar os nodes.

  **Solução:**
  ```typescript
  // src/components/flow/FlowCanvas.tsx - handleSelectTemplate
  const { fitView } = useReactFlow();

  const handleSelectTemplate = useCallback((template: DiagramTemplate) => {
    takeSnapshot(nodes, edges);
    setNodes(template.nodes || []);
    setEdges(template.edges || []);
    resetIdCounter(template.nodes || []);
    markDirty();
    toast.success(`Template "${template.name}" loaded`);
    // ADICIONAR ESTA LINHA:
    setTimeout(() => fitView({ padding: 0.2 }), 50);
  }, [nodes, edges, takeSnapshot, setNodes, setEdges, markDirty, fitView]);
  ```

  **Arquivo:** `src/components/flow/FlowCanvas.tsx`

  **Verificação:** Selecionar qualquer template → viewport deve ajustar automaticamente para mostrar todos os nodes.

---

## Milestone 1: Setup Infraestrutura de IA
**Objetivo:** Configurar a base para todas as features de IA.
**Prioridade:** P0 (Crítico)
**Estimativa:** ~2-3 horas
**Status:** ⬜ Não iniciado

### 1.1 Instalar Dependências
- [ ] **Adicionar @anthropic-ai/sdk ao projeto**

  **Por quê:** SDK oficial da Anthropic para comunicação com Claude API.

  **Comando:**
  ```bash
  npm install @anthropic-ai/sdk
  ```

- [ ] **Adicionar dagre para layout automático**

  **Por quê:** Biblioteca de layout de grafos para posicionar nodes automaticamente após geração.

  **Comando:**
  ```bash
  npm install dagre @types/dagre
  ```

### 1.2 Configurar Variáveis de Ambiente
- [ ] **Criar/atualizar .env.local com ANTHROPIC_API_KEY**

  **Por quê:** API key necessária para autenticação com Anthropic.

  **Arquivo:** `.env.local`
  ```
  ANTHROPIC_API_KEY=sk-ant-...
  ```

- [ ] **Adicionar variável ao .env.example**

  **Por quê:** Documentar para outros desenvolvedores.

  **Arquivo:** `.env.example`
  ```
  ANTHROPIC_API_KEY=your_api_key_here
  ```

### 1.3 Criar Cliente Anthropic
- [ ] **Criar src/lib/ai/client.ts**

  **Por quê:** Singleton para reutilizar conexão e centralizar configuração.

  **Conteúdo:**
  ```typescript
  import Anthropic from '@anthropic-ai/sdk';

  let client: Anthropic | null = null;

  export function getAnthropicClient(): Anthropic {
    if (!client) {
      client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
    return client;
  }
  ```

### 1.4 Criar API Route
- [ ] **Criar src/app/api/ai/route.ts**

  **Por quê:** Next.js API route para comunicação segura com Anthropic (esconde API key do frontend).

### 1.5 Criar Arquivo de Prompts
- [ ] **Criar src/lib/ai/prompts.ts**

  **Por quê:** Centralizar todos os prompts para fácil manutenção e iteração.

**Verificação M1:**
- [ ] `npm run build` passa sem erros
- [ ] API route responde em `/api/ai` (testar com curl ou Postman)

---

## Milestone 2: AI Discovery Flow - UI
**Objetivo:** Criar interface visual para o fluxo de perguntas guiadas.
**Prioridade:** P0 (Crítico)
**Estimativa:** ~5-6 horas
**Status:** ⬜ Não iniciado

### 2.1 Definir Tipos de Projeto
- [ ] **Criar src/config/projectTypes.ts**

  **Por quê:** Definir categorias de projetos disponíveis para o usuário escolher.

  **Tipos:**
  - Single AI Agent
  - Multi-Agent System
  - RAG Pipeline
  - Customer Service Agent
  - Data Pipeline

### 2.2 Criar Modal Principal
- [ ] **Criar src/components/discovery/DiscoveryModal.tsx**

  **Por quê:** Container principal para todo o fluxo de discovery.

  **Funcionalidades:**
  - Estado: 'select-type' | 'conversation' | 'generating' | 'complete'
  - Transições suaves entre estados
  - Botão de cancelar/fechar
  - Responsive (fullscreen mobile, modal desktop)

### 2.3 Criar Seletor de Tipo de Projeto
- [ ] **Criar src/components/discovery/ProjectTypeSelector.tsx**

  **Por quê:** Primeira etapa do fluxo - usuário escolhe o tipo de projeto.

  **Funcionalidades:**
  - Grid de cards com ícones e descrições
  - Hover effect nos cards
  - Agrupamento por categoria (opcional)
  - Callback para avançar ao selecionar

### 2.4 Criar Componente de Conversa
- [ ] **Criar src/components/discovery/ConversationFlow.tsx**

  **Por quê:** Interface de chat onde IA faz perguntas e usuário responde.

  **Funcionalidades:**
  - Lista de mensagens (IA e usuário)
  - Input de texto com Enter para enviar
  - Indicador de "IA pensando..."
  - Scroll automático para última mensagem
  - Resumo do que foi entendido até agora
  - Botão "Gerar Diagrama" quando IA indicar que está pronto

### 2.5 Criar Indicador de Geração
- [ ] **Criar src/components/discovery/GeneratingIndicator.tsx**

  **Por quê:** Feedback visual enquanto diagrama está sendo gerado.

### 2.6 Adicionar Botão no Toolbar
- [ ] **Modificar src/components/flow/FlowToolbar.tsx**

  **Por quê:** Ponto de entrada para o fluxo de discovery.

  **Mudança:**
  - Adicionar botão "New with AI" ou ícone de varinha mágica
  - Ao clicar, abrir DiscoveryModal
  - Posicionar próximo ao botão de templates

**Verificação M2:**
- [ ] Clicar "New with AI" → modal abre
- [ ] Escolher tipo de projeto → avança para conversa
- [ ] Interface de chat exibe corretamente mensagens
- [ ] Botão "Gerar" aparece após algumas respostas

---

## Milestone 3: AI Discovery Flow - Lógica
**Objetivo:** Implementar geração dinâmica de perguntas e diagrama.
**Prioridade:** P0 (Crítico)
**Estimativa:** ~6-8 horas
**Status:** ⬜ Não iniciado

### 3.1 Implementar Geração de Perguntas
- [ ] **Criar src/lib/ai/discoveryQuestions.ts**

  **Por quê:** Lógica para gerar perguntas contextuais via Claude.

- [ ] **Implementar função askNextQuestion()**

  **Assinatura:**
  ```typescript
  interface DiscoveryContext {
    projectType: ProjectType;
    answers: Array<{ question: string; answer: string }>;
  }

  interface QuestionResponse {
    status: 'question' | 'ready';
    question: string | null;
    understanding: string;
  }

  async function askNextQuestion(context: DiscoveryContext): Promise<QuestionResponse>
  ```

### 3.2 Implementar Geração de Diagrama
- [ ] **Criar src/lib/ai/generateDiagram.ts**

  **Por quê:** Transformar respostas do discovery em nodes e edges.

- [ ] **Implementar função generateDiagram()**

  **Assinatura:**
  ```typescript
  interface DiagramResult {
    nodes: Node[];
    edges: Edge[];
  }

  async function generateDiagram(context: DiscoveryContext): Promise<DiagramResult>
  ```

### 3.3 Implementar Layout Automático
- [ ] **Criar src/lib/ai/layoutDiagram.ts**

  **Por quê:** Posicionar nodes automaticamente usando dagre para evitar sobreposição.

### 3.4 Integrar com FlowCanvas
- [ ] **Modificar FlowCanvas para receber diagrama gerado**

  **Por quê:** Quando discovery termina, precisa popular o canvas com o diagrama.

### 3.5 Validação de Tipos de Node
- [ ] **Criar função de validação**

  **Por quê:** Garantir que Claude gerou tipos de node que existem no sistema.

**Verificação M3:**
- [ ] Responder perguntas → IA faz perguntas contextuais diferentes
- [ ] Após 4-6 respostas → IA indica "pronto para gerar"
- [ ] Clicar "Gerar" → diagrama aparece no canvas
- [ ] Nodes estão posicionados sem sobreposição
- [ ] Connections fazem sentido lógico
- [ ] Labels são descritivos

---

## Milestone 4: Templates Especializados
**Objetivo:** Criar templates úteis e específicos para casos de uso reais.
**Prioridade:** P1 (Importante)
**Estimativa:** ~4 horas
**Status:** ⬜ Não iniciado

### 4.1 Template: Customer Service Agent
- [ ] **Adicionar template em src/config/templates.ts**

  **Caso de uso:** Agente de atendimento que qualifica leads e agenda reuniões.

### 4.2 Template: Research Agent
- [ ] **Adicionar template em src/config/templates.ts**

  **Caso de uso:** Agente que pesquisa, sintetiza e gera relatórios.

### 4.3 Template: Code Review Agent
- [ ] **Adicionar template em src/config/templates.ts**

  **Caso de uso:** Agente que analisa PRs e sugere melhorias.

### 4.4 Template: RAG with Reranking
- [ ] **Adicionar template em src/config/templates.ts**

  **Caso de uso:** Pipeline RAG avançado com reranking para melhor precisão.

### 4.5 Template: Data Pipeline (ETL)
- [ ] **Adicionar template em src/config/templates.ts**

  **Caso de uso:** Pipeline de dados com extração, transformação e carga.

**Verificação M4:**
- [ ] Todos os 5 templates aparecem na galeria
- [ ] Selecionar cada template → viewport ajusta e mostra diagrama completo
- [ ] Nodes estão conectados logicamente
- [ ] Labels e descrições são úteis

---

## Milestone 5: Galeria Visual de Templates
**Objetivo:** Melhorar apresentação visual dos templates (inspiração Miro).
**Prioridade:** P1 (Importante)
**Estimativa:** ~5-6 horas
**Status:** ⬜ Não iniciado

### 5.1 Gerar Thumbnails dos Templates
- [ ] **Criar script para gerar screenshots ou screenshots manuais**
- [ ] **Salvar thumbnails em public/templates/**

### 5.2 Redesenhar TemplateGallery
- [ ] **Refatorar src/components/flow/TemplateGallery.tsx**

  **Mudanças:**
  - Cards maiores com thumbnails reais
  - Hover effect: zoom sutil + sombra
  - Badge de categoria (AI Agent, Architecture, Data)
  - Badge "NEW" para templates recentes
  - Contador de nodes/edges

### 5.3 Adicionar Filtros e Busca
- [ ] **Implementar filtro por categoria**
- [ ] **Implementar busca por nome/descrição**

### 5.4 Adicionar Seção "Start with AI"
- [ ] **Criar card especial para Discovery Flow**

**Verificação M5:**
- [ ] Galeria exibe thumbnails reais dos templates
- [ ] Filtros funcionam corretamente
- [ ] Busca encontra templates por nome
- [ ] Card "Start with AI" abre Discovery Modal

---

## Milestone 6: Export para Documentos
**Objetivo:** Gerar documentação a partir do diagrama.
**Prioridade:** P1 (Importante)
**Estimativa:** ~4 horas
**Status:** ⬜ Não iniciado

### 6.1 Criar Modal de Export
- [ ] **Criar src/components/export/ExportDocModal.tsx**

### 6.2 Implementar Geração de SPEC.md
- [ ] **Criar src/lib/ai/generateSpec.ts**

### 6.3 Implementar Geração de CLAUDE.md
- [ ] **Criar gerador de CLAUDE.md**

### 6.4 Implementar Export para Mermaid
- [ ] **Criar conversor para sintaxe Mermaid**

### 6.5 Adicionar Botão no Toolbar
- [ ] **Modificar FlowToolbar.tsx**

**Verificação M6:**
- [ ] Clicar "Export Doc" → modal abre
- [ ] Escolher SPEC.md → documento gerado faz sentido
- [ ] Botão de copiar funciona
- [ ] Download salva arquivo corretamente

---

## Milestone 7: LLM Local com RAG (v2)
**Objetivo:** Remover dependência de API paga, funcionar offline.
**Prioridade:** P2 (Futuro)
**Estimativa:** ~10-15 horas
**Status:** ⬜ Não iniciado

### 7.1 Setup Ollama
- [ ] **Documentar instalação do Ollama**
- [ ] **Criar script de verificação**

### 7.2 Criar Embeddings Pipeline
- [ ] **Criar src/lib/ai/local/embeddings.ts**

### 7.3 Configurar Vector Store
- [ ] **Criar src/lib/ai/local/vectorStore.ts**

### 7.4 Popular Base de Conhecimento
- [ ] **Criar documentos para RAG**
- [ ] **Criar script de indexação**

### 7.5 Criar RAG Chain
- [ ] **Criar src/lib/ai/local/ragChain.ts**

### 7.6 Criar Abstração de Provider
- [ ] **Criar src/lib/ai/provider.ts**

### 7.7 Adicionar Toggle no Settings
- [ ] **Criar UI para escolher provider**

**Verificação M7:**
- [ ] Ollama rodando localmente
- [ ] Modelos baixados e funcionando
- [ ] RAG retorna contexto relevante
- [ ] Discovery funciona igual com provider local
- [ ] Geração de diagrama funciona com LLM local

---

## Milestone 8: Napkin-style Text-to-Visual (P2)
**Objetivo:** Visualizar textos de pesquisa como diagramas.
**Prioridade:** P2 (Complementar)
**Estimativa:** ~6-8 horas
**Status:** ⬜ Não iniciado

### 8.1 Criar Interface de Input de Texto
- [ ] **Criar src/components/napkin/TextToVisualModal.tsx**

### 8.2 Implementar Parser de Texto
- [ ] **Criar src/lib/ai/textToVisual.ts**

### 8.3 Integrar com Canvas
- [ ] **Adicionar botão "Text to Visual" no toolbar**

**Verificação M8:**
- [ ] Colar texto de pesquisa → diagrama gerado
- [ ] Conceitos extraídos fazem sentido
- [ ] Relacionamentos conectam conceitos corretamente

---

## Resumo de Arquivos

### Novos Arquivos a Criar
| Arquivo | Milestone | Propósito |
|---------|-----------|-----------|
| `src/lib/ai/client.ts` | M1 | Cliente Anthropic |
| `src/lib/ai/prompts.ts` | M1 | Prompts centralizados |
| `src/app/api/ai/route.ts` | M1 | API route |
| `src/config/projectTypes.ts` | M2 | Tipos de projeto |
| `src/components/discovery/DiscoveryModal.tsx` | M2 | Modal principal |
| `src/components/discovery/ProjectTypeSelector.tsx` | M2 | Seletor de tipo |
| `src/components/discovery/ConversationFlow.tsx` | M2 | Chat com IA |
| `src/components/discovery/GeneratingIndicator.tsx` | M2 | Loading state |
| `src/lib/ai/discoveryQuestions.ts` | M3 | Lógica de perguntas |
| `src/lib/ai/generateDiagram.ts` | M3 | Geração de diagrama |
| `src/lib/ai/layoutDiagram.ts` | M3 | Auto-layout |
| `src/components/export/ExportDocModal.tsx` | M6 | Modal de export |
| `src/lib/ai/generateSpec.ts` | M6 | Gerador de SPEC.md |
| `src/lib/ai/local/` | M7 | Providers locais |
| `src/components/napkin/TextToVisualModal.tsx` | M8 | Text-to-visual |

### Arquivos a Modificar
| Arquivo | Milestones | Mudanças |
|---------|------------|----------|
| `src/components/flow/FlowCanvas.tsx` | M0, M3 | Fix viewport, integrar discovery |
| `src/components/flow/FlowToolbar.tsx` | M2, M6 | Botões "New with AI", "Export Doc" |
| `src/components/flow/TemplateGallery.tsx` | M5 | Redesign visual |
| `src/config/templates.ts` | M4 | Novos templates |
| `package.json` | M1 | Dependências |
| `.env.local` | M1 | API key |

---

## Estimativa Total

| Milestone | Descrição | Estimativa | Prioridade |
|-----------|-----------|------------|------------|
| M0 | Bug Fixes | 1h | P0 |
| M1 | Setup IA | 2-3h | P0 |
| M2 | Discovery UI | 5-6h | P0 |
| M3 | Discovery Lógica | 6-8h | P0 |
| M4 | Templates | 4h | P1 |
| M5 | Galeria Visual | 5-6h | P1 |
| M6 | Export Docs | 4h | P1 |
| M7 | LLM Local | 10-15h | P2 |
| M8 | Text-to-Visual | 6-8h | P2 |
| **Total P0** | | **~15-18h** | |
| **Total P0+P1** | | **~28-32h** | |
| **Total Completo** | | **~45-55h** | |

---

## Changelog

### Atualizações de Status
- [ ] M0 - ⬜ Não iniciado
- [ ] M1 - ⬜ Não iniciado
- [ ] M2 - ⬜ Não iniciado
- [ ] M3 - ⬜ Não iniciado
- [ ] M4 - ⬜ Não iniciado
- [ ] M5 - ⬜ Não iniciado
- [ ] M6 - ⬜ Não iniciado
- [ ] M7 - ⬜ Não iniciado
- [ ] M8 - ⬜ Não iniciado
