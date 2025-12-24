'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    Monitor,
    Server,
    Layers,
    Bot,
    Users,
    Workflow,
    Lightbulb,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DiagramGuide() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-background h-8">
                    <BookOpen className="h-4 w-4" />
                    Guide
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <BookOpen className="h-5 w-5" />
                        Diagram Design Guide
                    </DialogTitle>
                    <DialogDescription>
                        Learn how to create effective architecture diagrams and flowcharts for different project types.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="thinking" className="h-[600px]">
                    <TabsList className="grid grid-cols-6 w-full">
                        <TabsTrigger value="thinking" className="text-xs">
                            <Lightbulb className="h-3.5 w-3.5 mr-1" />
                            Thinking
                        </TabsTrigger>
                        <TabsTrigger value="frontend" className="text-xs">
                            <Monitor className="h-3.5 w-3.5 mr-1" />
                            Frontend
                        </TabsTrigger>
                        <TabsTrigger value="backend" className="text-xs">
                            <Server className="h-3.5 w-3.5 mr-1" />
                            Backend
                        </TabsTrigger>
                        <TabsTrigger value="fullstack" className="text-xs">
                            <Layers className="h-3.5 w-3.5 mr-1" />
                            Fullstack
                        </TabsTrigger>
                        <TabsTrigger value="ai-agents" className="text-xs">
                            <Bot className="h-3.5 w-3.5 mr-1" />
                            AI Agents
                        </TabsTrigger>
                        <TabsTrigger value="multi-agent" className="text-xs">
                            <Workflow className="h-3.5 w-3.5 mr-1" />
                            Multi-Agent
                        </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[530px] mt-4">
                        {/* HOW TO THINK TAB */}
                        <TabsContent value="thinking" className="space-y-6 pr-4">
                            <GuideSection
                                title="Como Pensar Antes de Desenhar"
                                icon={Lightbulb}
                            >
                                <p className="text-muted-foreground mb-4">
                                    Antes de começar a criar seu diagrama, siga este framework mental:
                                </p>

                                <div className="grid gap-4">
                                    <StepCard
                                        number={1}
                                        title="Defina o Propósito"
                                        description="Para quem é este diagrama? Desenvolvedores, stakeholders, ou documentação? O nível de detalhe depende do público."
                                    />
                                    <StepCard
                                        number={2}
                                        title="Identifique os Atores"
                                        description="Quem ou o que inicia as ações? Usuários, sistemas externos, eventos automáticos?"
                                    />
                                    <StepCard
                                        number={3}
                                        title="Mapeie o Fluxo Principal"
                                        description="Qual é o caminho feliz? Desenhe primeiro o fluxo ideal, sem exceções ou erros."
                                    />
                                    <StepCard
                                        number={4}
                                        title="Adicione Variações"
                                        description="Depois do fluxo principal, adicione tratamentos de erro, fluxos alternativos e casos especiais."
                                    />
                                    <StepCard
                                        number={5}
                                        title="Simplifique"
                                        description="Remova detalhes desnecessários. Um bom diagrama conta uma história clara sem sobrecarga visual."
                                    />
                                </div>
                            </GuideSection>

                            <GuideSection
                                title="Princípios de Design Visual"
                                icon={Zap}
                            >
                                <div className="grid md:grid-cols-2 gap-4">
                                    <TipCard
                                        type="do"
                                        title="Use Hierarquia Visual"
                                        description="Elementos importantes devem ser maiores ou ter cores mais fortes. Fluxo principal em destaque."
                                    />
                                    <TipCard
                                        type="do"
                                        title="Agrupe Logicamente"
                                        description="Use containers para agrupar componentes relacionados. Isso cria contexto visual."
                                    />
                                    <TipCard
                                        type="dont"
                                        title="Evite Linhas Cruzadas"
                                        description="Reorganize os elementos para minimizar cruzamentos. Linhas cruzadas confundem."
                                    />
                                    <TipCard
                                        type="dont"
                                        title="Não Sobrecarregue"
                                        description="Máximo de 15-20 elementos por diagrama. Divida em múltiplos diagramas se necessário."
                                    />
                                </div>
                            </GuideSection>

                            <GuideSection
                                title="Fluxo de Leitura"
                                icon={ArrowRight}
                            >
                                <p className="text-muted-foreground mb-4">
                                    Organize seu diagrama seguindo padrões de leitura naturais:
                                </p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Card className="p-4">
                                        <h4 className="font-medium text-sm mb-2">Esquerda → Direita</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Ideal para fluxos lineares e pipelines. User → Input → Process → Output
                                        </p>
                                    </Card>
                                    <Card className="p-4">
                                        <h4 className="font-medium text-sm mb-2">Cima → Baixo</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Bom para hierarquias e fluxos de decisão. Cliente → API → Serviços → DB
                                        </p>
                                    </Card>
                                    <Card className="p-4">
                                        <h4 className="font-medium text-sm mb-2">Centro → Fora</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Para sistemas com componente central. Orquestrador no centro, workers ao redor.
                                        </p>
                                    </Card>
                                </div>
                            </GuideSection>
                        </TabsContent>

                        {/* FRONTEND TAB */}
                        <TabsContent value="frontend" className="space-y-6 pr-4">
                            <GuideSection
                                title="Diagramas para Projetos Frontend"
                                icon={Monitor}
                            >
                                <p className="text-muted-foreground mb-4">
                                    Foque na arquitetura de componentes, fluxo de dados e interações do usuário.
                                </p>

                                <h4 className="font-medium mb-3">Componentes Recomendados:</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <ComponentBadge name="User" description="Representa o usuário final" />
                                    <ComponentBadge name="Frontend" description="Componentes/páginas da aplicação" />
                                    <ComponentBadge name="Backend" description="APIs que o frontend consome" />
                                    <ComponentBadge name="Cloud" description="CDN, hosting, storage" />
                                </div>

                                <h4 className="font-medium mb-3">Exemplo de Estrutura:</h4>
                                <Card className="p-4 bg-muted/30">
                                    <pre className="text-xs text-muted-foreground">
{`User
  ↓
[Frontend App]
  ├── Pages (rotas)
  ├── Components (UI)
  ├── State Management
  └── API Layer
        ↓
[Backend API]`}
                                    </pre>
                                </Card>

                                <h4 className="font-medium mt-4 mb-3">Dicas Específicas:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Mostre o fluxo de dados entre componentes (props, context, state)
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Use containers para agrupar features ou domínios
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Indique se componentes são client-side ou server-side (SSR)
                                    </li>
                                </ul>
                            </GuideSection>
                        </TabsContent>

                        {/* BACKEND TAB */}
                        <TabsContent value="backend" className="space-y-6 pr-4">
                            <GuideSection
                                title="Diagramas para Projetos Backend"
                                icon={Server}
                            >
                                <p className="text-muted-foreground mb-4">
                                    Foque em APIs, serviços, bancos de dados e integrações externas.
                                </p>

                                <h4 className="font-medium mb-3">Componentes Recomendados:</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <ComponentBadge name="Backend" description="Serviços e APIs" />
                                    <ComponentBadge name="Database" description="Banco de dados" />
                                    <ComponentBadge name="Cloud" description="Infraestrutura cloud" />
                                    <ComponentBadge name="Tool" description="Serviços externos" />
                                </div>

                                <h4 className="font-medium mb-3">Padrões Comuns:</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Card className="p-4">
                                        <h5 className="font-medium text-sm mb-2">Monolito</h5>
                                        <pre className="text-xs text-muted-foreground">
{`Client → [API Gateway]
              ↓
        [Monolith App]
              ↓
         [Database]`}
                                        </pre>
                                    </Card>
                                    <Card className="p-4">
                                        <h5 className="font-medium text-sm mb-2">Microservices</h5>
                                        <pre className="text-xs text-muted-foreground">
{`Client → [API Gateway]
         ↙    ↓    ↘
    [Svc A] [Svc B] [Svc C]
       ↓       ↓       ↓
    [DB A]  [DB B]  [DB C]`}
                                        </pre>
                                    </Card>
                                </div>

                                <h4 className="font-medium mt-4 mb-3">Dicas Específicas:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Indique protocolos de comunicação (REST, gRPC, GraphQL)
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Mostre filas de mensagens (RabbitMQ, Kafka) se houver
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Use labels nas conexões para indicar o tipo de dados
                                    </li>
                                </ul>
                            </GuideSection>
                        </TabsContent>

                        {/* FULLSTACK TAB */}
                        <TabsContent value="fullstack" className="space-y-6 pr-4">
                            <GuideSection
                                title="Diagramas para Projetos Fullstack"
                                icon={Layers}
                            >
                                <p className="text-muted-foreground mb-4">
                                    Combine as perspectivas de frontend e backend, mostrando a arquitetura completa.
                                </p>

                                <h4 className="font-medium mb-3">Estrutura em Camadas:</h4>
                                <Card className="p-4 bg-muted/30">
                                    <pre className="text-xs text-muted-foreground">
{`┌─────────────────────────────────────┐
│         PRESENTATION LAYER          │
│  [User] → [Frontend App] → [CDN]    │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│          APPLICATION LAYER          │
│    [API Gateway] → [Services]       │
│         [Auth] [Business Logic]     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│            DATA LAYER               │
│   [Database] [Cache] [Storage]      │
└─────────────────────────────────────┘`}
                                    </pre>
                                </Card>

                                <h4 className="font-medium mt-4 mb-3">Dicas para Fullstack:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Use containers para separar as camadas visualmente
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Mostre claramente os pontos de integração
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Indique tecnologias específicas (Next.js, Express, PostgreSQL)
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Considere fazer diagramas separados para visões macro e micro
                                    </li>
                                </ul>
                            </GuideSection>
                        </TabsContent>

                        {/* AI AGENTS TAB */}
                        <TabsContent value="ai-agents" className="space-y-6 pr-4">
                            <GuideSection
                                title="Diagramas para Agentes de IA"
                                icon={Bot}
                            >
                                <p className="text-muted-foreground mb-4">
                                    Projete fluxos de agentes autônomos para atendimento comercial e automação.
                                </p>

                                <h4 className="font-medium mb-3">Componentes Essenciais:</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <ComponentBadge name="Agent" description="O agente de IA autônomo" />
                                    <ComponentBadge name="LLM" description="Modelo de linguagem" />
                                    <ComponentBadge name="Memory" description="Contexto e histórico" />
                                    <ComponentBadge name="Tool" description="Ferramentas disponíveis" />
                                    <ComponentBadge name="Input" description="Entrada de dados" />
                                </div>

                                <h4 className="font-medium mb-3">Fluxo de Atendimento Comercial:</h4>
                                <Card className="p-4 bg-muted/30">
                                    <pre className="text-xs text-muted-foreground">
{`[Cliente (WhatsApp/Chat)]
          ↓
     [Input Parser] ← classifica intenção
          ↓
   [Sales Agent] ← agente principal
      ├── [LLM] ← gera respostas
      ├── [Memory] ← histórico do cliente
      └── [Tools]
           ├── [CRM] ← consulta dados
           ├── [Catalog] ← produtos
           └── [Scheduler] ← agendamentos
          ↓
     [Response]`}
                                    </pre>
                                </Card>

                                <h4 className="font-medium mt-4 mb-3">Dicas para Agentes de Atendimento:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Mostre claramente o loop de raciocínio do agente
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Indique quando há handoff para humano
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Documente as ferramentas disponíveis para o agente
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Use cores para diferenciar tipos de interação
                                    </li>
                                </ul>
                            </GuideSection>
                        </TabsContent>

                        {/* MULTI-AGENT TAB */}
                        <TabsContent value="multi-agent" className="space-y-6 pr-4">
                            <GuideSection
                                title="Sistemas Multi-Agent"
                                icon={Workflow}
                            >
                                <p className="text-muted-foreground mb-4">
                                    Projete sistemas com múltiplos agentes especializados trabalhando juntos.
                                </p>

                                <h4 className="font-medium mb-3">Padrões de Arquitetura:</h4>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <Card className="p-4">
                                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Orchestrator Pattern
                                        </h5>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Um agente central coordena e delega para especialistas.
                                        </p>
                                        <pre className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
{`    [Orchestrator]
     ↙    ↓    ↘
[Research] [Writer] [Reviewer]`}
                                        </pre>
                                    </Card>
                                    <Card className="p-4">
                                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                                            <Workflow className="h-4 w-4" />
                                            Pipeline Pattern
                                        </h5>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Agentes em sequência, cada um processa e passa adiante.
                                        </p>
                                        <pre className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
{`[Collector] → [Analyzer] → [Generator]`}
                                        </pre>
                                    </Card>
                                </div>

                                <h4 className="font-medium mb-3">Exemplo: Sistema de Pesquisa Multi-Agent</h4>
                                <Card className="p-4 bg-muted/30">
                                    <pre className="text-xs text-muted-foreground">
{`[User Request]
      ↓
[Planner Agent] ← define estratégia
      ↓
┌─────────────────────────────────────┐
│        PARALLEL EXECUTION           │
│  [Web Search]  [Doc Search]  [RAG]  │
│       ↓            ↓          ↓     │
│    results     results    results   │
└─────────────────────────────────────┘
      ↓
[Synthesizer Agent] ← consolida tudo
      ↓
[Quality Checker] ← valida resposta
      ↓
[Final Response]`}
                                    </pre>
                                </Card>

                                <h4 className="font-medium mt-4 mb-3">Boas Práticas Multi-Agent:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Defina claramente a responsabilidade de cada agente
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Indique fluxos paralelos vs sequenciais
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Mostre a memória compartilhada entre agentes
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Use cores diferentes para cada tipo de agente
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                        Considere loops de feedback e retry logic
                                    </li>
                                </ul>
                            </GuideSection>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

function GuideSection({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5 text-primary" />
                {title}
            </h3>
            {children}
        </div>
    );
}

function StepCard({
    number,
    title,
    description,
}: {
    number: number;
    title: string;
    description: string;
}) {
    return (
        <Card className="p-4 flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                {number}
            </div>
            <div>
                <h4 className="font-medium text-sm">{title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
        </Card>
    );
}

function TipCard({
    type,
    title,
    description,
}: {
    type: 'do' | 'dont';
    title: string;
    description: string;
}) {
    return (
        <Card className={cn(
            'p-4 border-l-4',
            type === 'do' ? 'border-l-green-500' : 'border-l-red-500'
        )}>
            <div className="flex items-center gap-2 mb-2">
                {type === 'do' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {type === 'do' ? 'Do' : "Don't"}
                </span>
            </div>
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </Card>
    );
}

function ComponentBadge({
    name,
    description,
}: {
    name: string;
    description: string;
}) {
    return (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-xs">
            <span className="font-medium">{name}</span>
            <span className="text-muted-foreground">- {description}</span>
        </div>
    );
}
