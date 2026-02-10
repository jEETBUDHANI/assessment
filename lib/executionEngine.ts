import { Node, Edge } from 'reactflow';
import { getTopologicalSort } from './dagValidator';

export interface ExecutionResult {
    nodeId: string;
    status: 'success' | 'failed';
    output?: any;
    error?: string;
    duration: number;
}

export interface NodeExecutionInput {
    node: Node;
    incomingData: Record<string, any>;
}

export class ExecutionEngine {
    private nodes: Node[];
    private edges: Edge[];
    private executionId?: string;
    private results: Map<string, any> = new Map();
    private onNodeStart: (nodeId: string) => void;
    private onNodeComplete: (nodeId: string, result: any) => void;

    constructor(
        nodes: Node[],
        edges: Edge[],
        onNodeStart: (nodeId: string) => void,
        onNodeComplete: (nodeId: string, result: any) => void,
        executionId?: string
    ) {
        this.nodes = nodes;
        this.edges = edges;
        this.onNodeStart = onNodeStart;
        this.onNodeComplete = onNodeComplete;
        this.executionId = executionId;
    }

    async execute() {
        const levels = getTopologicalSort(this.nodes, this.edges);

        for (const level of levels) {
            // Execute all nodes in the current level concurrently
            await Promise.all(level.map(nodeId => this.executeNode(nodeId)));
        }
    }

    private async executeNode(nodeId: string) {
        const node = this.nodes.find(n => n.id === nodeId)!;

        // Merge node's static data with incoming data from edges
        const incomingData: Record<string, any> = { ...node.data };
        const incomingEdges = this.edges.filter(e => e.target === nodeId);

        incomingEdges.forEach(edge => {
            const sourceResult = this.results.get(edge.source);
            if (sourceResult) {
                // Map source output to target input handle, overriding static data if any
                const targetHandle = edge.targetHandle || 'default';
                incomingData[targetHandle] = sourceResult;
            }
        });

        this.onNodeStart(nodeId);

        const startTime = Date.now();
        try {
            // Here we would call the Trigger.dev task via an API route
            // For now, we simulate a delay
            const result = await this.triggerTask(node, incomingData);

            this.results.set(nodeId, result);
            this.onNodeComplete(nodeId, {
                status: 'success',
                output: result,
                duration: Date.now() - startTime
            });
        } catch (error: any) {
            this.onNodeComplete(nodeId, {
                status: 'failed',
                error: error.message,
                duration: Date.now() - startTime
            });
            throw error; // Fail the entire level if a critical dependency fails
        }
    }

    private async triggerTask(node: Node, inputs: Record<string, any>) {
        const response = await fetch('/api/execute/node', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nodeId: node.id,
                nodeType: node.type,
                inputs,
                executionId: this.executionId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Execution failed');
        }

        const data = await response.json();
        return data.output;
    }
}
