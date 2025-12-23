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
    agent: { label: 'Agent', icon: Bot, color: 'border-blue-500 bg-blue-50' },
    llm: { label: 'LLM Model', icon: Brain, color: 'border-purple-500 bg-purple-50' },
    tool: { label: 'Tool', icon: HardDrive, color: 'border-orange-500 bg-orange-50' },
    memory: { label: 'Memory', icon: Database, color: 'border-yellow-500 bg-yellow-50' },
    input: { label: 'User Input', icon: MessageSquare, color: 'border-green-500 bg-green-50' },

    // Architecture
    frontend: { label: 'Frontend', icon: Layout, color: 'border-indigo-500 bg-indigo-50' },
    backend: { label: 'Backend API', icon: Server, color: 'border-slate-500 bg-slate-50' },
    database: { label: 'Database', icon: Database, color: 'border-cyan-500 bg-cyan-50' },
    cloud: { label: 'Cloud Service', icon: Cloud, color: 'border-sky-500 bg-sky-50' },

    // General
    user: { label: 'User', icon: User, color: 'border-gray-500 bg-gray-50' },
    note: { label: 'Note', icon: FileText, color: 'border-yellow-200 bg-yellow-100' },
    container: { label: 'Group', icon: Box, color: 'border-dashed border-gray-400 bg-transparent' },
} as const;

export type NodeType = keyof typeof NODE_CONFIG;
