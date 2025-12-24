import {
    Bot,
    Brain,
    Database,
    Globe,
    HardDrive,
    Layout,
    MessageSquare,
    Server,
    User,
    Box,
    FileText,
    Cloud
} from 'lucide-react';

export const NODE_CONFIG = {
    // AI Agents
    agent: {
        label: 'Agent',
        icon: Bot,
        color: 'border-blue-500 bg-blue-50',
        tooltip: 'Autonomous AI agent that orchestrates tasks and coordinates with other components'
    },
    llm: {
        label: 'LLM Model',
        icon: Brain,
        color: 'border-purple-500 bg-purple-50',
        tooltip: 'Large Language Model for text generation, reasoning, and decision making'
    },
    tool: {
        label: 'Tool',
        icon: HardDrive,
        color: 'border-orange-500 bg-orange-50',
        tooltip: 'External function or API that agents can invoke to perform actions'
    },
    memory: {
        label: 'Memory',
        icon: Database,
        color: 'border-yellow-500 bg-yellow-50',
        tooltip: 'Vector database or context storage for long-term agent memory'
    },
    input: {
        label: 'User Input',
        icon: MessageSquare,
        color: 'border-green-500 bg-green-50',
        tooltip: 'Entry point for user queries, prompts, or system inputs'
    },

    // Architecture
    frontend: {
        label: 'Frontend',
        icon: Layout,
        color: 'border-indigo-500 bg-indigo-50',
        tooltip: 'Web or mobile UI layer that users interact with directly'
    },
    backend: {
        label: 'Backend API',
        icon: Server,
        color: 'border-slate-500 bg-slate-50',
        tooltip: 'Server-side logic, REST/GraphQL APIs, and business rules'
    },
    database: {
        label: 'Database',
        icon: Database,
        color: 'border-cyan-500 bg-cyan-50',
        tooltip: 'Persistent data storage: SQL, NoSQL, or vector databases'
    },
    cloud: {
        label: 'Cloud Service',
        icon: Cloud,
        color: 'border-sky-500 bg-sky-50',
        tooltip: 'External cloud services: AWS, GCP, Azure, or third-party APIs'
    },

    // General
    user: {
        label: 'User',
        icon: User,
        color: 'border-gray-500 bg-gray-50',
        tooltip: 'Human user or actor interacting with the system'
    },
    note: {
        label: 'Note',
        icon: FileText,
        color: 'border-yellow-200 bg-yellow-100',
        tooltip: 'Text annotation for documentation and explanations'
    },
    container: {
        label: 'Group',
        icon: Box,
        color: 'border-dashed border-gray-400 bg-transparent',
        tooltip: 'Visual container to group related components together'
    },
} as const;

export type NodeType = keyof typeof NODE_CONFIG;
