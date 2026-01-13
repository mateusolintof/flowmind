# FlowMind - Roadmap Estratégico

> **Posicionamento:** "FlowMind - O parceiro de pensamento visual para arquitetos de sistemas de IA"

## Decisões Estratégicas

| Aspecto | Decisão |
|---------|---------|
| **LLM v1** | Anthropic API (Claude) via Next.js API Routes |
| **LLM v2** | Local LLM + RAG (Ollama) - futuro |
| **Perguntas** | Dinâmicas (geradas pela IA com base no contexto) |
| **Napkin-style** | P2 - complementar, não é o core |
| **Prioridade** | AI Discovery Flow (M0-M3) |

---

## Prioridades

- **P0 (MVP):** M0-M3 (~15-18h) - Discovery Flow funcional
- **P1:** M4-M5 (~10-14h) - Templates + Gallery
- **P2:** M6-M8 (~20h) - Export, LLM Local, Napkin

---

## Milestones

### M0: Fix Templates Viewport
**Prioridade:** P0 | **Estimativa:** 30min

**Problema:** Templates aparecem "quebrados" porque o viewport não se ajusta após carregar.

**Tarefas:**
- [ ] Adicionar `fitView()` após carregar template em `handleSelectTemplate`

**Arquivos:**
- `src/components/flow/FlowCanvas.tsx`

**Verificação:**
- Carregar qualquer template e verificar se todos os nodes aparecem centralizados

---

### M1: Setup Infraestrutura de IA
**Prioridade:** P0 | **Estimativa:** 2-3h

**Objetivo:** Preparar a infraestrutura para comunicação segura com a API da Anthropic.

**Tarefas:**
- [ ] Instalar dependência `@anthropic-ai/sdk`
- [ ] Criar API Route `app/api/ai/route.ts` para comunicação segura
- [ ] Criar arquivo de prompts `lib/ai/prompts.ts`
- [ ] Configurar variável de ambiente `ANTHROPIC_API_KEY`
- [ ] Criar hook `useAI` para abstrair chamadas

**Arquivos a criar:**
- `src/app/api/ai/route.ts`
- `src/lib/ai/prompts.ts`
- `src/lib/ai/client.ts`
- `src/hooks/ai/useAI.ts`

**Verificação:**
- Testar chamada simples à API via endpoint

---

### M2: AI Discovery Flow - UI
**Prioridade:** P0 | **Estimativa:** 4-5h

**Objetivo:** Criar os componentes visuais do fluxo de descoberta.

**Tarefas:**
- [ ] Criar componente `DiscoveryPanel.tsx` - painel lateral/modal
- [ ] Criar componente `QuestionCard.tsx` - exibe pergunta + input
- [ ] Criar componente `DiscoveryProgress.tsx` - indicador de progresso
- [ ] Criar componente `DiscoverySummary.tsx` - resumo antes de gerar
- [ ] Integrar com estado global (Zustand store)
- [ ] Adicionar botão "AI Discovery" na Sidebar

**Arquivos a criar:**
- `src/components/discovery/DiscoveryPanel.tsx`
- `src/components/discovery/QuestionCard.tsx`
- `src/components/discovery/DiscoveryProgress.tsx`
- `src/components/discovery/DiscoverySummary.tsx`
- `src/store/discoveryStore.ts`

**Verificação:**
- UI funciona com dados mockados
- Transições entre estados são suaves

---

### M3: AI Discovery Flow - Lógica
**Prioridade:** P0 | **Estimativa:** 6-8h

**Objetivo:** Implementar a geração dinâmica de perguntas e a geração do diagrama.

**Tarefas:**
- [ ] Implementar geração de perguntas dinâmicas via Claude
- [ ] Criar prompts específicos para cada fase do discovery
- [ ] Implementar análise de respostas para próxima pergunta
- [ ] Criar função de geração de diagrama a partir das respostas
- [ ] Implementar auto-layout com Dagre
- [ ] Testar fluxo completo end-to-end

**Arquivos a modificar:**
- `src/lib/ai/prompts.ts`
- `src/hooks/ai/useAI.ts`
- `src/store/discoveryStore.ts`
- `src/components/discovery/*.tsx`

**Dependências:**
- Instalar `dagre` e `@types/dagre` para auto-layout

**Verificação:**
- Fluxo completo funciona: pergunta -> resposta -> próxima pergunta -> gera diagrama
- Diagrama gerado faz sentido visual e arquitetural

---

### M4: Templates Inteligentes
**Prioridade:** P1 | **Estimativa:** 4-5h

**Objetivo:** Expandir templates existentes e criar templates específicos para IA.

**Tarefas:**
- [ ] Criar templates para arquiteturas comuns de IA (RAG, Multi-Agent, etc.)
- [ ] Adicionar descrições detalhadas em cada template
- [ ] Implementar preview de template antes de aplicar
- [ ] Categorizar templates por caso de uso

**Arquivos:**
- `src/config/templates.ts`
- `src/components/templates/TemplatePreview.tsx`

---

### M5: Galeria de Diagramas
**Prioridade:** P1 | **Estimativa:** 6-8h

**Objetivo:** Criar sistema de galeria para visualizar e gerenciar diagramas salvos.

**Tarefas:**
- [ ] Criar página de galeria com grid de previews
- [ ] Implementar geração de thumbnails
- [ ] Adicionar filtros e busca
- [ ] Implementar ações (duplicar, deletar, renomear)

---

### M6: Export Avançado
**Prioridade:** P2 | **Estimativa:** 4-5h

**Objetivo:** Expandir opções de exportação.

**Tarefas:**
- [ ] Export como SVG
- [ ] Export como JSON estruturado
- [ ] Export como Markdown (documentação)
- [ ] Compartilhamento via link (requer backend)

---

### M7: LLM Local + RAG
**Prioridade:** P2 | **Estimativa:** 10-12h

**Objetivo:** Adicionar suporte a LLM local para uso offline e privacidade.

**Tarefas:**
- [ ] Integrar Ollama como backend alternativo
- [ ] Implementar sistema de RAG com documentação de arquiteturas
- [ ] Criar UI para seleção de modelo
- [ ] Otimizar prompts para modelos menores

---

### M8: Napkin-style Generation
**Prioridade:** P2 | **Estimativa:** 6-8h

**Objetivo:** Geração de diagramas a partir de texto livre (estilo Napkin.ai).

**Tarefas:**
- [ ] Criar input de texto livre
- [ ] Implementar parsing de texto para estrutura de diagrama
- [ ] Sugerir refinamentos após geração inicial

---

## Notas de Implementação

### Estrutura de Pastas (após implementação)

```
src/
├── app/
│   └── api/
│       └── ai/
│           └── route.ts          # API Route para Anthropic
├── components/
│   ├── discovery/                # Componentes do Discovery Flow
│   │   ├── DiscoveryPanel.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── DiscoveryProgress.tsx
│   │   └── DiscoverySummary.tsx
│   └── templates/
│       └── TemplatePreview.tsx
├── hooks/
│   └── ai/
│       └── useAI.ts              # Hook para chamadas de IA
├── lib/
│   └── ai/
│       ├── client.ts             # Cliente Anthropic
│       └── prompts.ts            # Prompts do sistema
└── store/
    └── discoveryStore.ts         # Estado do Discovery
```

### Fluxo do AI Discovery

```
[Usuário clica "AI Discovery"]
         ↓
[DiscoveryPanel abre]
         ↓
[Pergunta inicial: "O que você quer construir?"]
         ↓
[Usuário responde]
         ↓
[Claude analisa e gera próxima pergunta contextual]
         ↓
[Loop: 3-5 perguntas dinâmicas]
         ↓
[DiscoverySummary: mostra resumo das respostas]
         ↓
[Usuário confirma]
         ↓
[Claude gera estrutura do diagrama]
         ↓
[Dagre aplica auto-layout]
         ↓
[Diagrama aparece no canvas]
```

---

## Changelog

| Data | Milestone | Status |
|------|-----------|--------|
| - | M0: Fix Templates | Pendente |
| - | M1: Setup IA | Pendente |
| - | M2: Discovery UI | Pendente |
| - | M3: Discovery Lógica | Pendente |
