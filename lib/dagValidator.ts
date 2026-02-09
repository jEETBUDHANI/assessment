import { Node, Edge } from 'reactflow';

export function validateDAG(nodes: Node[], edges: Edge[]): { isValid: boolean; error?: string } {
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach(node => {
        adj.set(node.id, []);
        inDegree.set(node.id, 0);
    });

    edges.forEach(edge => {
        const targets = adj.get(edge.source) || [];
        targets.push(edge.target);
        adj.set(edge.source, targets);
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
        if (degree === 0) queue.push(nodeId);
    });

    let count = 0;
    const sorted: string[] = [];

    while (queue.length > 0) {
        const u = queue.shift()!;
        sorted.push(u);
        count++;

        const neighbors = adj.get(u) || [];
        neighbors.forEach(v => {
            inDegree.set(v, inDegree.get(v)! - 1);
            if (inDegree.get(v) === 0) {
                queue.push(v);
            }
        });
    }

    if (count !== nodes.length) {
        return { isValid: false, error: 'Circular dependency detected (Workflow must be a DAG)' };
    }

    return { isValid: true };
}

export function getTopologicalSort(nodes: Node[], edges: Edge[]): string[][] {
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach(node => {
        adj.set(node.id, []);
        inDegree.set(node.id, 0);
    });

    edges.forEach(edge => {
        const targets = adj.get(edge.source) || [];
        targets.push(edge.target);
        adj.set(edge.source, targets);
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Level-based topological sort for parallel execution
    let currentLevel: string[] = [];
    inDegree.forEach((degree, nodeId) => {
        if (degree === 0) currentLevel.push(nodeId);
    });

    const levels: string[][] = [];
    while (currentLevel.length > 0) {
        levels.push([...currentLevel]);
        const nextLevel: string[] = [];

        currentLevel.forEach(u => {
            const neighbors = adj.get(u) || [];
            neighbors.forEach(v => {
                inDegree.set(v, inDegree.get(v)! - 1);
                if (inDegree.get(v) === 0) {
                    nextLevel.push(v);
                }
            });
        });

        currentLevel = nextLevel;
    }

    return levels;
}
