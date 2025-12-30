import { get, set, del } from 'idb-keyval';
import { Edge, Node, Viewport } from '@xyflow/react';
import { supabase } from './supabase';
import { toast } from 'sonner';
import { setSyncStatus } from '@/store/syncStatusStore';

const STORAGE_KEY = 'flowmind-canvas'; // Legacy key for migration only
const DIAGRAMS_PREFIX = 'flowmind-diagram-';
const DIAGRAMS_LIST_KEY = 'flowmind-diagrams-list';
const CURRENT_DIAGRAM_KEY = 'flowmind-current-diagram';
const USER_ID_KEY = 'flowmind-user-id';

export type FlowState = {
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
    updatedAt: number;
};

export type Diagram = {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
};

export type DiagramWithData = Diagram & {
    data: FlowState;
};

// ==================== IN-MEMORY CACHE ====================

/**
 * In-memory cache for diagrams list to avoid repeated IndexedDB reads.
 * Updated on write operations via saveDiagramsList.
 */
let diagramsCache: Diagram[] | null = null;

// ==================== HELPERS ====================

/**
 * Get or create persistent anonymous user ID
 */
const getUserId = async () => {
    if (typeof window === 'undefined') return 'server-side';
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
};

/**
 * Generate a unique diagram ID
 */
const generateDiagramId = () => crypto.randomUUID();

/**
 * Get storage key for a specific diagram
 */
const getDiagramKey = (diagramId: string) => `${DIAGRAMS_PREFIX}${diagramId}`;

// ==================== DIAGRAM LIST OPERATIONS ====================

/**
 * Get the list of all diagrams (metadata only, no data)
 * Uses in-memory cache to avoid repeated IndexedDB reads.
 */
export const listDiagrams = async (): Promise<Diagram[]> => {
    if (diagramsCache !== null) {
        return diagramsCache;
    }
    const diagrams = await get<Diagram[]>(DIAGRAMS_LIST_KEY);
    diagramsCache = diagrams ?? [];
    return diagramsCache;
};

/**
 * Save the diagrams list and update cache
 */
const saveDiagramsList = async (diagrams: Diagram[]) => {
    diagramsCache = diagrams; // Update cache immediately
    await set(DIAGRAMS_LIST_KEY, diagrams);
};

/**
 * Get the current diagram ID
 */
export const getCurrentDiagramId = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CURRENT_DIAGRAM_KEY);
};

/**
 * Set the current diagram ID
 */
export const setCurrentDiagramId = (diagramId: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_DIAGRAM_KEY, diagramId);
    }
};

// ==================== DIAGRAM CRUD OPERATIONS ====================

/**
 * Create a new diagram with optional initial data
 */
export const createDiagram = async (
    name: string = 'Untitled Diagram',
    initialData?: FlowState
): Promise<Diagram> => {
    const now = Date.now();
    const diagram: Diagram = {
        id: generateDiagramId(),
        name,
        createdAt: now,
        updatedAt: now,
    };

    // Add to list (uses cache)
    const diagrams = await listDiagrams();
    const updatedDiagrams = [diagram, ...diagrams]; // Add at beginning
    await saveDiagramsList(updatedDiagrams);

    // Save initial data
    const data: FlowState = initialData ?? {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        updatedAt: now,
    };
    await set(getDiagramKey(diagram.id), data);

    // Set as current
    setCurrentDiagramId(diagram.id);

    return diagram;
};

/**
 * Rename a diagram
 */
export const renameDiagram = async (diagramId: string, newName: string): Promise<void> => {
    const diagrams = await listDiagrams();
    const index = diagrams.findIndex(d => d.id === diagramId);

    if (index !== -1) {
        const updatedDiagrams = [...diagrams];
        updatedDiagrams[index] = {
            ...diagrams[index],
            name: newName,
            updatedAt: Date.now(),
        };
        await saveDiagramsList(updatedDiagrams);
    }
};

/**
 * Delete a diagram
 */
export const deleteDiagram = async (diagramId: string): Promise<string | null> => {
    const diagrams = await listDiagrams();
    const filtered = diagrams.filter(d => d.id !== diagramId);
    await saveDiagramsList(filtered);

    // Delete data
    await del(getDiagramKey(diagramId));

    // If deleted current diagram, switch to another or create new
    const currentId = getCurrentDiagramId();
    if (currentId === diagramId) {
        if (filtered.length > 0) {
            setCurrentDiagramId(filtered[0].id);
            return filtered[0].id;
        } else {
            // Create a new diagram if none left
            const newDiagram = await createDiagram();
            return newDiagram.id;
        }
    }

    return null; // No switch needed
};

/**
 * Duplicate a diagram
 */
export const duplicateDiagram = async (diagramId: string): Promise<Diagram | null> => {
    const [data, diagrams] = await Promise.all([
        loadDiagramById(diagramId),
        listDiagrams()
    ]);
    const original = diagrams.find(d => d.id === diagramId);

    if (!data || !original) return null;

    const newDiagram = await createDiagram(`${original.name} (copy)`, data);
    return newDiagram;
};

// ==================== DIAGRAM DATA OPERATIONS ====================

/**
 * Load a diagram by ID
 */
export const loadDiagramById = async (diagramId: string): Promise<FlowState | null> => {
    return await get(getDiagramKey(diagramId)) ?? null;
};

/**
 * Save a diagram by ID
 * Optimized to avoid redundant IndexedDB reads using cache.
 */
export const saveDiagramById = async (
    diagramId: string,
    state: FlowState,
    showToast = false
): Promise<void> => {
    // Get diagrams from cache (single read, reused for both local and cloud)
    const diagrams = await listDiagrams();
    const index = diagrams.findIndex(d => d.id === diagramId);
    const diagram = index !== -1 ? diagrams[index] : null;

    // Update local storage - batch both writes
    const localSavePromise = set(getDiagramKey(diagramId), state);

    // Update diagram metadata if found
    let listSavePromise: Promise<void> | null = null;
    if (index !== -1) {
        const updatedDiagrams = [...diagrams];
        updatedDiagrams[index] = {
            ...diagrams[index],
            updatedAt: Date.now(),
        };
        listSavePromise = saveDiagramsList(updatedDiagrams);
    }

    // Wait for local saves to complete
    await Promise.all([localSavePromise, listSavePromise].filter(Boolean));

    // Cloud sync
    if (typeof window !== 'undefined' && !navigator.onLine) {
        setSyncStatus('offline');
        if (showToast) {
            toast.success('Saved locally (offline)');
        }
        return;
    }

    setSyncStatus('syncing');

    let cloudSaveSuccess = false;
    try {
        const userId = await getUserId();

        // Use upsert with the unique constraint on (user_id, diagram_id)
        const { error } = await supabase
            .from('diagrams')
            .upsert(
                {
                    user_id: userId,
                    diagram_id: diagramId,
                    name: diagram?.name ?? 'Untitled',
                    data: state,
                    updated_at: new Date().toISOString()
                },
                {
                    onConflict: 'user_id,diagram_id',
                    ignoreDuplicates: false
                }
            );

        if (error) {
            console.error('Supabase save error:', error);
            setSyncStatus('error');
        } else {
            cloudSaveSuccess = true;
            setSyncStatus('synced');
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    } catch (err) {
        console.warn('Supabase sync failed, using local only', err);
        setSyncStatus('error');
    }

    if (showToast) {
        toast.success(cloudSaveSuccess ? 'Saved to cloud' : 'Saved locally');
    }
};

// ==================== MIGRATION ====================

/**
 * Migrate legacy single-diagram storage to multi-diagram format
 */
export const migrateLegacyStorage = async (): Promise<string> => {
    const diagrams = await listDiagrams();

    // If we already have diagrams, just return the current one
    if (diagrams.length > 0) {
        const currentId = getCurrentDiagramId();
        if (currentId && diagrams.find(d => d.id === currentId)) {
            return currentId;
        }
        // Return first diagram if current is invalid
        setCurrentDiagramId(diagrams[0].id);
        return diagrams[0].id;
    }

    // Try to load legacy data
    const legacyData = await get<FlowState>(STORAGE_KEY);

    if (legacyData && legacyData.nodes && legacyData.nodes.length > 0) {
        // Migrate legacy data to new format
        const diagram = await createDiagram('My First Diagram', legacyData);
        console.log('Migrated legacy diagram to new format');
        return diagram.id;
    }

    // No legacy data, create a fresh diagram
    const diagram = await createDiagram('My First Diagram');
    return diagram.id;
};
