# Conteúdo dos Guias para FlowMind

Este arquivo contém o CONTEÚDO que deve aparecer nos guias dentro da aplicação. O AI Agent deve incorporar esse conteúdo na seção de Guias e nos tooltips dos componentes.

---

## Guia 1: Padrões de Agentes de IA

### O que é um Agente de IA?
Um sistema que consegue perceber o ambiente, pensar sobre o que fazer, agir, e aprender com os resultados. Diferente de um LLM puro que só responde perguntas, um agente executa tarefas usando ferramentas.

### Padrões Principais

**Single Agent (Agente Único)**
Um agente faz tudo. Use quando a tarefa é simples e bem definida.
Exemplo: Assistente que responde perguntas sobre um produto.

**Multi-Agent Sequencial**
Vários agentes em fila, a saída de um é entrada do próximo. Use quando há etapas claras.
Exemplo: Agente 1 extrai dados → Agente 2 analisa → Agente 3 formata relatório.

**Multi-Agent Paralelo**
Vários agentes trabalham ao mesmo tempo em sub-tarefas. Use para reduzir tempo ou obter múltiplas perspectivas.
Exemplo: Um analisa sentimento, outro extrai keywords, outro classifica - depois um agregador junta tudo.

**Orquestrador**
Um agente central decide qual especialista chamar. Use quando não sabe de antemão qual caminho seguir.
Exemplo: Usuário pede algo complexo, orquestrador decide se manda pro agente de código, de pesquisa ou de análise.

**ReAct (Reasoning + Acting)**
O agente alterna entre pensar e agir em loop. Use quando precisa de raciocínio passo-a-passo.
Exemplo: "Preciso saber X" → busca → "Agora que sei X, preciso calcular Y" → calcula → responde.

**Reflection (Reflexão)**
O agente revisa e melhora seu próprio output. Use quando qualidade é crítica.
Exemplo: Gera código → critica o código → melhora → entrega versão final.

### Componentes de um Agente
- **LLM/Modelo**: O cérebro que raciocina
- **Tools/Ferramentas**: APIs, buscas, calculadoras que o agente pode usar
- **Memória de curto prazo**: Contexto da conversa atual
- **Memória de longo prazo**: Informações persistentes entre sessões
- **Knowledge Base**: Base de conhecimento para RAG

---

## Guia 2: Arquitetura de Software

### Tipos de Arquitetura

**Monolito**
Tudo em uma aplicação só. Simples de começar, difícil de escalar partes específicas.
Use para: MVPs, projetos pequenos, times pequenos.

**Microserviços**
Vários serviços independentes que se comunicam. Complexo mas escala bem.
Use para: Aplicações grandes, times grandes, quando partes diferentes precisam escalar diferente.

**Serverless**
Funções que rodam sob demanda, sem gerenciar servidores. Paga só pelo uso.
Use para: APIs, webhooks, processamento de eventos esporádicos.

**Event-Driven**
Serviços se comunicam por eventos assíncronos. Baixo acoplamento.
Use para: Sistemas distribuídos, integrações, quando ordem não importa.

### Componentes Comuns

**API Gateway**: Entrada única para todas APIs. Faz roteamento, auth, rate limiting.

**Load Balancer**: Distribui tráfego entre múltiplas instâncias do mesmo serviço.

**Message Queue**: Fila de mensagens para comunicação assíncrona entre serviços.

**Cache**: Armazenamento rápido temporário. Usa para dados lidos frequentemente.

**CDN**: Rede que entrega arquivos estáticos (imagens, JS, CSS) de servidores próximos ao usuário.

**Banco SQL**: Para dados relacionais, quando precisa de transações ACID.

**Banco NoSQL**: Para dados flexíveis, quando estrutura varia ou precisa de alta escala.

**Vector DB**: Para embeddings e busca semântica (usado em RAG).

### Padrões de Comunicação

**REST**: Requisições HTTP simples. GET, POST, PUT, DELETE. Mais comum.

**GraphQL**: Cliente pede exatamente o que precisa. Bom quando dados são complexos.

**WebSocket**: Conexão persistente. Bom para real-time (chat, notificações).

**gRPC**: Alta performance. Bom para comunicação interna entre microserviços.

**Eventos/Mensagens**: Assíncrono via filas. Bom para desacoplar serviços.

---

## Guia 3: Quando Usar O Quê

### Para Agentes de IA
- Tarefa simples? → Single Agent
- Etapas em sequência? → Multi-Agent Sequencial
- Sub-tarefas paralelas? → Multi-Agent Paralelo
- Precisa de especialistas dinâmicos? → Orquestrador
- Precisa explicar o raciocínio? → ReAct
- Qualidade precisa ser perfeita? → Reflection

### Para Arquitetura
- Começando projeto? → Monolito
- Precisa escalar partes diferentes? → Microserviços
- Funções esporádicas? → Serverless
- Alta disponibilidade + desacoplamento? → Event-Driven

### Para Bancos de Dados
- Dados com relacionamentos? → SQL (PostgreSQL, MySQL)
- Dados flexíveis/documentos? → NoSQL Document (MongoDB)
- Cache/sessões? → Redis
- Busca semântica/embeddings? → Vector DB (Pinecone, Qdrant)

---

## Tooltips para Componentes

Quando o usuário passar o mouse em um componente da biblioteca, mostrar uma descrição curta:

**Agente Orquestrador**: Coordena outros agentes. Decide quem faz o quê.

**Agente Worker**: Executa tarefas específicas. Recebe ordens do orquestrador.

**LLM/Modelo**: O cérebro que processa linguagem e raciocina.

**Tool/Ferramenta**: Algo que o agente pode usar (API, busca, código).

**Memória**: Onde o agente guarda informações (curta = conversa atual, longa = persistente).

**Knowledge Base**: Base de conhecimento para o agente consultar.

**Frontend**: Interface que o usuário vê e interage.

**Backend/API**: Servidor que processa lógica e dados.

**Banco de Dados**: Onde os dados ficam salvos permanentemente.

**Fila de Mensagens**: Canal para serviços se comunicarem de forma assíncrona.

**Cache**: Armazenamento rápido para dados frequentes.

**API Gateway**: Porta de entrada única para suas APIs.

**Load Balancer**: Distribui requisições entre múltiplos servidores.

**CDN**: Entrega arquivos estáticos rapidamente de servidores próximos.

**Usuário/Cliente**: Quem usa o sistema (pessoa ou outro sistema).

---

Fim do conteúdo dos guias.



---

# FlowMind - Spec para AI Agent

## Contexto do Usuário

O usuário tem TDAH e está começando a trabalhar com desenvolvimento de Agentes de IA e aplicações fullstack. Ele tem dificuldade com:
- Ferramentas de diagramas tradicionais (Lucidchart, Draw.io, Miro) - muitas opções causam paralisia
- Não sabe regras de fluxogramas ou qual formato de shape usar
- Precisa de algo visual para planejar arquiteturas antes de codar
- Tem dificuldade em desenhar, então precisa de componentes prontos para arrastar

Ele gosta muito de interfaces baseadas em **nodes** (estilo React Flow) e quer uma ferramenta pessoal para:
1. Criar arquiteturas de software visualmente
2. Mapear fluxos de Agentes de IA
3. Montar infográficos explicativos (como os exemplos em anexo)

---

## O Que Construir

Uma aplicação web de **canvas infinito** com visual de nodes que permita:

### Funcionalidade Core
- Arrastar e soltar componentes pré-definidos no canvas
- Conectar componentes com linhas/setas
- Desenhar à mão livre, fazer anotações e adicionar notas
- Salvar e carregar os canvas criados
- Exportar como imagem (PNG ou SVG)

### Interface Simplificada
A interface deve ser minimalista. Nada de dezenas de opções. O usuário quer:
- Uma sidebar com componentes organizados por categoria
- Um canvas grande e limpo
- Ferramentas básicas de desenho (seta, linha, texto, forma básica)
- Botão de salvar e botão de exportar
- Lista dos canvas salvos para poder voltar neles

### Componentes Pré-Definidos (Biblioteca)
Criar uma biblioteca de componentes visuais que o usuário pode arrastar pro canvas. Categorias:

**Para Agentes de IA:**
- Agente (com variações: orquestrador, worker, especialista)
- LLM / Modelo
- Ferramenta / Tool
- Memória (curta e longa prazo)
- Knowledge Base / RAG
- Input do usuário
- Output / Resposta

**Para Arquitetura de Software:**
- Frontend / Cliente
- Backend / Servidor
- API / Endpoint
- Banco de dados (SQL, NoSQL, Cache, Vector)
- Fila de mensagens
- Load Balancer
- API Gateway
- CDN
- Serviços de Cloud (AWS, Azure, GCP) - usar ícones oficiais

**Genéricos:**
- Caixa de texto
- Nota / Post-it
- Usuário / Pessoa
- Seta direcional
- Agrupador / Container

### Sistema de Guias
IMPORTANTE: O usuário não sabe todas as regras de arquitetura. A aplicação deve ter guias embutidos que ajudam ele a entender:
- Quando usar cada tipo de componente
- Padrões comuns de arquitetura de agentes (single agent, multi-agent, orchestrator, etc)
- Padrões comuns de arquitetura de software (monolito, microserviços, serverless)
- Dicas de boas práticas

Esses guias podem aparecer como:
- Tooltips ao passar o mouse nos componentes
- Uma seção de "Guias" acessível pelo menu
- Sugestões contextuais baseadas no que o usuário está fazendo

### Persistência
- Salvar automaticamente o trabalho (auto-save)
- Permitir criar múltiplos canvas com nomes diferentes
- Armazenar localmente no browser (não precisa de backend complexo)
- Permitir exportar/importar como arquivo JSON para backup

---

## Requisitos Técnicos

### Stack Recomendada
Pesquise as versões mais atuais de dezembro de 2025 antes de implementar:
- **Framework**: Next.js (App Router) - versão estável mais recente
- **Nodes/Canvas**: React Flow (@xyflow/react) - pesquise a documentação atual
- **Desenho livre**: tldraw ou Excalidraw (como biblioteca React) - avalie qual é mais simples de integrar
- **UI Components**: shadcn/ui com Tailwind CSS
- **Persistência local**: IndexedDB (use uma biblioteca que simplifique, como Dexie.js ou idb-keyval)
- **Ícones**: Lucide React para UI, ícones oficiais de cloud providers para componentes de arquitetura

### Comportamentos Esperados

**Canvas:**
- Zoom in/out com scroll ou pinch
- Pan (arrastar o canvas) com espaço+drag ou middle click
- Selecionar múltiplos elementos
- Deletar com tecla Delete ou Backspace
- Desfazer/Refazer (Ctrl+Z / Ctrl+Shift+Z)

**Nodes:**
- Arrastar da sidebar para o canvas
- Mover livremente no canvas
- Conectar uns aos outros com edges/linhas
- Editar o texto/label clicando
- Redimensionar se fizer sentido
- Ter cores diferentes por categoria

**Desenho:**
- Alternar entre modo "node" e modo "desenho"
- No modo desenho: lápis, seta, retângulo, texto
- Poder desenhar por cima ou por baixo dos nodes

**Salvamento:**
- Auto-save a cada 30 segundos quando há mudanças
- Indicador visual de "salvando..." e "salvo"
- Lista de canvas salvos na tela inicial ou em um menu

---

## Design e UX

### Princípios (TDAH-friendly)
1. **Menos é mais**: Só mostrar o essencial. Esconder opções avançadas.
2. **Feedback imediato**: Animações sutis quando arrasta, solta, conecta.
3. **Consistência visual**: Cada categoria de componente tem uma cor. Sempre a mesma.
4. **Atalhos**: Usuários avançados podem usar teclado, mas não é obrigatório saber.
5. **Não perder trabalho**: Auto-save agressivo. Nunca deixar o usuário perder o que fez.

### Visual
- Tema escuro como padrão (com opção de claro)
- Cores vibrantes mas não agressivas para os nodes
- Canvas com grid sutil de fundo
- Sidebar colapsável para dar mais espaço ao canvas
- Minimap no canto para navegação em canvas grandes

### Paleta de Cores Sugerida (pode ajustar)
- Agentes de IA: tons de roxo/violeta
- Serviços/Backend: tons de azul
- Databases: tons de verde-azulado
- Frontend/UI: tons de amarelo/laranja
- Usuários: tons de verde
- Cloud: usar as cores oficiais de cada provider (AWS laranja, Azure azul, GCP multicolor)

---

## Referências Visuais

O usuário enviou 3 imagens de referência:

1. **Infográfico de Agente Comercial**: Mostra um fluxo de agente de IA com cliente → canais (WhatsApp, Email, Chat) → agente central → CRM/ERP → equipe humana. Tem seções de "Cérebro e Memória", "Treinamento", "Caixa de Ferramentas".

2. **Hub de Agentes**: Diagrama simples mostrando múltiplos agentes conectando a um hub central, que por sua vez conecta a sistemas via MCP e A2A. Também mostra um Copilot e como um Prompt pode criar um novo agente.

3. **Arquitetura de AI Agent**: Infográfico mais técnico mostrando o ciclo Percepção → Brain → Ação, com componentes de Storage (Memory, Knowledge), Decision Making, Tools, e interação com o Environment.

A aplicação deve permitir criar esse tipo de visualização arrastando componentes e conectando-os.

---

## O Que NÃO Fazer

- NÃO criar um sistema de login/autenticação - é uma ferramenta pessoal
- NÃO fazer backend complexo - persistência local é suficiente
- NÃO adicionar colaboração em tempo real - não é necessário
- NÃO colocar muitas opções de customização - manter simples
- NÃO exigir que o usuário saiba regras de diagramas - os componentes já vêm formatados corretamente

---

## Entregáveis

1. Aplicação web funcional rodando localmente
2. Instruções de como rodar (npm install, npm run dev, etc)
3. Pelo menos 20 componentes pré-definidos na biblioteca
4. Pelo menos 3 templates de exemplo (1 de agente de IA, 1 de arquitetura de software, 1 de infográfico)
5. Guias básicos integrados explicando os padrões principais
6. Funcionalidade de salvar/carregar funcionando
7. Exportação de imagem funcionando

---

## Ordem de Prioridade

Se precisar priorizar, faça nesta ordem:

1. **PRIMEIRO**: Canvas funcionando com nodes arrastáveis e conectáveis
2. **SEGUNDO**: Salvamento local funcionando (não perder trabalho!)
3. **TERCEIRO**: Biblioteca de componentes básica
4. **QUARTO**: Funcionalidade de desenho/anotação
5. **QUINTO**: Exportação de imagem
6. **SEXTO**: Guias e tooltips
7. **SÉTIMO**: Templates prontos
8. **OITAVO**: Polish visual e animações

---

## Notas Finais

- Pesquise a documentação atual das bibliotecas antes de implementar
- Teste frequentemente se arrastar e conectar está funcionando bem
- O usuário vai usar isso para planejar ANTES de codar, então precisa ser rápido de usar
- Foque em funcionar bem, não em ter muitas features
- Quando em dúvida, escolha a opção mais simples

Data: 23/12/2025