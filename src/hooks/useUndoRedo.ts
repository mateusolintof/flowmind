import { useCallback, useState } from 'react';
import { Edge, Node } from '@xyflow/react';

type HistoryState = {
    nodes: Node[];
    edges: Edge[];
};

export const useUndoRedo = () => {
    const [past, setPast] = useState<HistoryState[]>([]);
    const [future, setFuture] = useState<HistoryState[]>([]);

    const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
        setPast((prev) => {
            // Limit history size to 50 for performance
            const newPast = [...prev, { nodes, edges }];
            if (newPast.length > 50) {
                return newPast.slice(newPast.length - 50);
            }
            return newPast;
        });
        setFuture([]);
    }, []);

    const undo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
        if (past.length === 0) return null;

        const newPast = [...past];
        const previousState = newPast.pop();

        if (previousState) {
            setPast(newPast);
            setFuture((prev) => [...prev, { nodes: currentNodes, edges: currentEdges }]);
            return previousState;
        }
        return null;
    }, [past]);

    const redo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
        if (future.length === 0) return null;

        const newFuture = [...future];
        const nextState = newFuture.pop();

        if (nextState) {
            setFuture(newFuture);
            setPast((prev) => [...prev, { nodes: currentNodes, edges: currentEdges }]);
            return nextState;
        }
        return null;
    }, [future]);

    return {
        undo,
        redo,
        takeSnapshot,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
    };
};
