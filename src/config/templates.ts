import { Node, Edge } from '@xyflow/react';

export interface DiagramTemplate {
    id: string;
    name: string;
    description: string;
    category: 'ai-agents' | 'architecture' | 'flowchart' | 'general';
    thumbnail?: string;
    nodes: Node[];
    edges: Edge[];
}

export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
    {
        id: 'single-agent',
        name: 'Single AI Agent',
        description: 'Basic AI agent with tools and memory',
        category: 'ai-agents',
        nodes: [
            {
                id: 'user-1',
                type: 'user',
                position: { x: 50, y: 150 },
                data: { label: 'User' },
            },
            {
                id: 'input-1',
                type: 'input',
                position: { x: 200, y: 150 },
                data: { label: 'Input' },
            },
            {
                id: 'agent-1',
                type: 'agent',
                position: { x: 400, y: 100 },
                data: { label: 'AI Agent' },
            },
            {
                id: 'llm-1',
                type: 'llm',
                position: { x: 400, y: 250 },
                data: { label: 'LLM' },
            },
            {
                id: 'memory-1',
                type: 'memory',
                position: { x: 600, y: 50 },
                data: { label: 'Memory' },
            },
            {
                id: 'tool-1',
                type: 'tool',
                position: { x: 600, y: 150 },
                data: { label: 'Search Tool' },
            },
            {
                id: 'tool-2',
                type: 'tool',
                position: { x: 600, y: 250 },
                data: { label: 'Calculator' },
            },
        ],
        edges: [
            { id: 'e1', source: 'user-1', target: 'input-1', type: 'custom' },
            { id: 'e2', source: 'input-1', target: 'agent-1', type: 'custom' },
            { id: 'e3', source: 'agent-1', target: 'llm-1', type: 'custom' },
            { id: 'e4', source: 'agent-1', target: 'memory-1', type: 'custom' },
            { id: 'e5', source: 'agent-1', target: 'tool-1', type: 'custom' },
            { id: 'e6', source: 'agent-1', target: 'tool-2', type: 'custom' },
        ],
    },
    {
        id: 'multi-agent',
        name: 'Multi-Agent System',
        description: 'Orchestrator with specialized worker agents',
        category: 'ai-agents',
        nodes: [
            {
                id: 'user-1',
                type: 'user',
                position: { x: 50, y: 200 },
                data: { label: 'User' },
            },
            {
                id: 'orchestrator-1',
                type: 'agent',
                position: { x: 250, y: 200 },
                data: { label: 'Orchestrator', color: 'hsl(217, 91%, 60%)' },
            },
            {
                id: 'agent-research',
                type: 'agent',
                position: { x: 500, y: 50 },
                data: { label: 'Research Agent' },
            },
            {
                id: 'agent-writer',
                type: 'agent',
                position: { x: 500, y: 200 },
                data: { label: 'Writer Agent' },
            },
            {
                id: 'agent-reviewer',
                type: 'agent',
                position: { x: 500, y: 350 },
                data: { label: 'Reviewer Agent' },
            },
            {
                id: 'llm-1',
                type: 'llm',
                position: { x: 750, y: 200 },
                data: { label: 'Shared LLM' },
            },
            {
                id: 'memory-1',
                type: 'memory',
                position: { x: 250, y: 400 },
                data: { label: 'Shared Memory' },
            },
        ],
        edges: [
            { id: 'e1', source: 'user-1', target: 'orchestrator-1', type: 'custom' },
            { id: 'e2', source: 'orchestrator-1', target: 'agent-research', type: 'custom' },
            { id: 'e3', source: 'orchestrator-1', target: 'agent-writer', type: 'custom' },
            { id: 'e4', source: 'orchestrator-1', target: 'agent-reviewer', type: 'custom' },
            { id: 'e5', source: 'agent-research', target: 'llm-1', type: 'custom' },
            { id: 'e6', source: 'agent-writer', target: 'llm-1', type: 'custom' },
            { id: 'e7', source: 'agent-reviewer', target: 'llm-1', type: 'custom' },
            { id: 'e8', source: 'orchestrator-1', target: 'memory-1', type: 'custom' },
        ],
    },
    {
        id: 'rag-pipeline',
        name: 'RAG Pipeline',
        description: 'Retrieval-Augmented Generation system',
        category: 'ai-agents',
        nodes: [
            {
                id: 'user-1',
                type: 'user',
                position: { x: 50, y: 150 },
                data: { label: 'User Query' },
            },
            {
                id: 'input-1',
                type: 'input',
                position: { x: 200, y: 150 },
                data: { label: 'Query Processor' },
            },
            {
                id: 'memory-1',
                type: 'memory',
                position: { x: 400, y: 50 },
                data: { label: 'Vector DB' },
            },
            {
                id: 'tool-1',
                type: 'tool',
                position: { x: 400, y: 150 },
                data: { label: 'Retriever' },
            },
            {
                id: 'agent-1',
                type: 'agent',
                position: { x: 600, y: 150 },
                data: { label: 'RAG Agent' },
            },
            {
                id: 'llm-1',
                type: 'llm',
                position: { x: 800, y: 150 },
                data: { label: 'LLM' },
            },
            {
                id: 'database-1',
                type: 'database',
                position: { x: 400, y: 280 },
                data: { label: 'Documents' },
            },
        ],
        edges: [
            { id: 'e1', source: 'user-1', target: 'input-1', type: 'custom' },
            { id: 'e2', source: 'input-1', target: 'tool-1', type: 'custom' },
            { id: 'e3', source: 'tool-1', target: 'memory-1', type: 'custom' },
            { id: 'e4', source: 'tool-1', target: 'agent-1', type: 'custom' },
            { id: 'e5', source: 'agent-1', target: 'llm-1', type: 'custom' },
            { id: 'e6', source: 'database-1', target: 'memory-1', type: 'custom' },
        ],
    },
    {
        id: 'microservices',
        name: 'Microservices Architecture',
        description: 'Basic microservices with API gateway',
        category: 'architecture',
        nodes: [
            {
                id: 'user-1',
                type: 'user',
                position: { x: 50, y: 200 },
                data: { label: 'Client' },
            },
            {
                id: 'frontend-1',
                type: 'frontend',
                position: { x: 200, y: 200 },
                data: { label: 'Web App' },
            },
            {
                id: 'backend-gateway',
                type: 'backend',
                position: { x: 400, y: 200 },
                data: { label: 'API Gateway' },
            },
            {
                id: 'backend-users',
                type: 'backend',
                position: { x: 600, y: 50 },
                data: { label: 'Users Service' },
            },
            {
                id: 'backend-orders',
                type: 'backend',
                position: { x: 600, y: 200 },
                data: { label: 'Orders Service' },
            },
            {
                id: 'backend-products',
                type: 'backend',
                position: { x: 600, y: 350 },
                data: { label: 'Products Service' },
            },
            {
                id: 'database-users',
                type: 'database',
                position: { x: 800, y: 50 },
                data: { label: 'Users DB' },
            },
            {
                id: 'database-orders',
                type: 'database',
                position: { x: 800, y: 200 },
                data: { label: 'Orders DB' },
            },
            {
                id: 'database-products',
                type: 'database',
                position: { x: 800, y: 350 },
                data: { label: 'Products DB' },
            },
        ],
        edges: [
            { id: 'e1', source: 'user-1', target: 'frontend-1', type: 'custom' },
            { id: 'e2', source: 'frontend-1', target: 'backend-gateway', type: 'custom' },
            { id: 'e3', source: 'backend-gateway', target: 'backend-users', type: 'custom' },
            { id: 'e4', source: 'backend-gateway', target: 'backend-orders', type: 'custom' },
            { id: 'e5', source: 'backend-gateway', target: 'backend-products', type: 'custom' },
            { id: 'e6', source: 'backend-users', target: 'database-users', type: 'custom' },
            { id: 'e7', source: 'backend-orders', target: 'database-orders', type: 'custom' },
            { id: 'e8', source: 'backend-products', target: 'database-products', type: 'custom' },
        ],
    },
    {
        id: 'serverless',
        name: 'Serverless Architecture',
        description: 'Cloud functions with event-driven design',
        category: 'architecture',
        nodes: [
            {
                id: 'user-1',
                type: 'user',
                position: { x: 50, y: 150 },
                data: { label: 'Client' },
            },
            {
                id: 'cloud-api',
                type: 'cloud',
                position: { x: 200, y: 150 },
                data: { label: 'API Gateway' },
            },
            {
                id: 'cloud-fn1',
                type: 'cloud',
                position: { x: 400, y: 50 },
                data: { label: 'Lambda: Auth' },
            },
            {
                id: 'cloud-fn2',
                type: 'cloud',
                position: { x: 400, y: 150 },
                data: { label: 'Lambda: Process' },
            },
            {
                id: 'cloud-fn3',
                type: 'cloud',
                position: { x: 400, y: 250 },
                data: { label: 'Lambda: Notify' },
            },
            {
                id: 'database-1',
                type: 'database',
                position: { x: 600, y: 100 },
                data: { label: 'DynamoDB' },
            },
            {
                id: 'cloud-s3',
                type: 'cloud',
                position: { x: 600, y: 250 },
                data: { label: 'S3 Storage' },
            },
        ],
        edges: [
            { id: 'e1', source: 'user-1', target: 'cloud-api', type: 'custom' },
            { id: 'e2', source: 'cloud-api', target: 'cloud-fn1', type: 'custom' },
            { id: 'e3', source: 'cloud-api', target: 'cloud-fn2', type: 'custom' },
            { id: 'e4', source: 'cloud-fn2', target: 'cloud-fn3', type: 'custom' },
            { id: 'e5', source: 'cloud-fn1', target: 'database-1', type: 'custom' },
            { id: 'e6', source: 'cloud-fn2', target: 'database-1', type: 'custom' },
            { id: 'e7', source: 'cloud-fn3', target: 'cloud-s3', type: 'custom' },
        ],
    },
    {
        id: 'basic-flowchart',
        name: 'Basic Flowchart',
        description: 'Simple process flow with start, process, decision, and end',
        category: 'flowchart',
        nodes: [
            {
                id: 'fc-start',
                type: 'flowchart-start',
                position: { x: 250, y: 50 },
                data: { label: 'Start', description: 'Process begins here' },
            },
            {
                id: 'fc-input',
                type: 'flowchart-io',
                position: { x: 250, y: 150 },
                data: { label: 'User Input', description: 'Receive user data' },
            },
            {
                id: 'fc-process1',
                type: 'flowchart-process',
                position: { x: 250, y: 250 },
                data: { label: 'Process Data', description: 'Validate and process' },
            },
            {
                id: 'fc-decision',
                type: 'flowchart-decision',
                position: { x: 250, y: 350 },
                data: { label: 'Is Valid?', description: 'Check validation result' },
            },
            {
                id: 'fc-success',
                type: 'flowchart-result',
                position: { x: 100, y: 470 },
                data: { label: 'Success', description: 'Process completed' },
            },
            {
                id: 'fc-error',
                type: 'flowchart-action',
                position: { x: 400, y: 470 },
                data: { label: 'Handle Error', description: 'Show error message' },
            },
            {
                id: 'fc-end',
                type: 'flowchart-end',
                position: { x: 250, y: 580 },
                data: { label: 'End', description: 'Process ends' },
            },
        ],
        edges: [
            { id: 'fc-e1', source: 'fc-start', target: 'fc-input', type: 'custom' },
            { id: 'fc-e2', source: 'fc-input', target: 'fc-process1', type: 'custom' },
            { id: 'fc-e3', source: 'fc-process1', target: 'fc-decision', type: 'custom' },
            { id: 'fc-e4', source: 'fc-decision', target: 'fc-success', type: 'custom', label: 'Yes', data: { labelPreset: 'success' } },
            { id: 'fc-e5', source: 'fc-decision', target: 'fc-error', type: 'custom', label: 'No', data: { labelPreset: 'error' } },
            { id: 'fc-e6', source: 'fc-success', target: 'fc-end', type: 'custom' },
            { id: 'fc-e7', source: 'fc-error', target: 'fc-end', type: 'custom' },
        ],
    },
    {
        id: 'decision-tree',
        name: 'Decision Tree',
        description: 'Multi-level decision branching structure',
        category: 'flowchart',
        nodes: [
            {
                id: 'dt-start',
                type: 'flowchart-start',
                position: { x: 350, y: 50 },
                data: { label: 'Start', description: 'Begin evaluation' },
            },
            {
                id: 'dt-condition1',
                type: 'flowchart-condition',
                position: { x: 350, y: 150 },
                data: { label: 'Condition A', description: 'First check' },
            },
            {
                id: 'dt-condition2',
                type: 'flowchart-condition',
                position: { x: 150, y: 280 },
                data: { label: 'Condition B', description: 'Second check' },
            },
            {
                id: 'dt-condition3',
                type: 'flowchart-condition',
                position: { x: 550, y: 280 },
                data: { label: 'Condition C', description: 'Third check' },
            },
            {
                id: 'dt-action1',
                type: 'flowchart-action',
                position: { x: 50, y: 410 },
                data: { label: 'Action 1', description: 'Execute path A-B' },
            },
            {
                id: 'dt-action2',
                type: 'flowchart-action',
                position: { x: 250, y: 410 },
                data: { label: 'Action 2', description: 'Execute path A-!B' },
            },
            {
                id: 'dt-action3',
                type: 'flowchart-action',
                position: { x: 450, y: 410 },
                data: { label: 'Action 3', description: 'Execute path !A-C' },
            },
            {
                id: 'dt-action4',
                type: 'flowchart-action',
                position: { x: 650, y: 410 },
                data: { label: 'Action 4', description: 'Execute path !A-!C' },
            },
            {
                id: 'dt-end',
                type: 'flowchart-end',
                position: { x: 350, y: 530 },
                data: { label: 'End', description: 'Decision complete' },
            },
        ],
        edges: [
            { id: 'dt-e1', source: 'dt-start', target: 'dt-condition1', type: 'custom' },
            { id: 'dt-e2', source: 'dt-condition1', target: 'dt-condition2', type: 'custom', label: 'Yes', data: { labelPreset: 'success' } },
            { id: 'dt-e3', source: 'dt-condition1', target: 'dt-condition3', type: 'custom', label: 'No', data: { labelPreset: 'warning' } },
            { id: 'dt-e4', source: 'dt-condition2', target: 'dt-action1', type: 'custom', label: 'Yes', data: { labelPreset: 'success' } },
            { id: 'dt-e5', source: 'dt-condition2', target: 'dt-action2', type: 'custom', label: 'No', data: { labelPreset: 'warning' } },
            { id: 'dt-e6', source: 'dt-condition3', target: 'dt-action3', type: 'custom', label: 'Yes', data: { labelPreset: 'success' } },
            { id: 'dt-e7', source: 'dt-condition3', target: 'dt-action4', type: 'custom', label: 'No', data: { labelPreset: 'warning' } },
            { id: 'dt-e8', source: 'dt-action1', target: 'dt-end', type: 'custom' },
            { id: 'dt-e9', source: 'dt-action2', target: 'dt-end', type: 'custom' },
            { id: 'dt-e10', source: 'dt-action3', target: 'dt-end', type: 'custom' },
            { id: 'dt-e11', source: 'dt-action4', target: 'dt-end', type: 'custom' },
        ],
    },
    {
        id: 'blank',
        name: 'Blank Canvas',
        description: 'Start from scratch',
        category: 'general',
        nodes: [],
        edges: [],
    },
];

export function getTemplatesByCategory(category?: string) {
    if (!category || category === 'all') return DIAGRAM_TEMPLATES;
    return DIAGRAM_TEMPLATES.filter((t) => t.category === category);
}
