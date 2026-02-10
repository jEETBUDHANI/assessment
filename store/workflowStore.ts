import { create } from 'zustand';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges
} from 'reactflow';

export interface WorkflowState {
    nodes: Node[];
    edges: Edge[];
    isRunning: boolean;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (connection: Connection) => void;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    activeWorkflowId: string | null;
    setActiveWorkflowId: (id: string | null) => void;
    updateNodeData: (nodeId: string, data: any) => void;
    setRunning: (isRunning: boolean) => void;
    runSingleNode: (nodeId: string) => Promise<void>;
    runSelectedNodes: (nodeIds: string[]) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: [],
    edges: [],
    isRunning: false,
    activeWorkflowId: null,
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge({ ...connection, animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 } }, get().edges),
        });
    },
    setNodes: (nodes: Node[]) => set({ nodes }),
    setEdges: (edges: Edge[]) => set({ edges }),
    addNode: (node: Node) => set({ nodes: [...get().nodes, node] }),
    updateNodeData: (nodeId: string, data: any) => {
        set({
            nodes: get().nodes.map((n: Node) => n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n),
        });
    },
    setActiveWorkflowId: (id: string | null) => set({ activeWorkflowId: id }),
    setRunning: (isRunning: boolean) => set({ isRunning }),
    runSingleNode: async (nodeId: string) => {
        let { nodes, edges, activeWorkflowId, updateNodeData } = get();
        const node = nodes.find((n: Node) => n.id === nodeId);
        if (!node) return;

        set({ isRunning: true });
        updateNodeData(nodeId, { executing: true, result: null });

        // Ensure workflow exists for history
        if (!activeWorkflowId) {
            try {
                const res = await fetch('/api/workflows', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: "Demo Workflow", nodes, edges })
                });
                const data = await res.json();
                activeWorkflowId = data.id;
                set({ activeWorkflowId });
            } catch (err) {
                console.error("Failed to save workflow for history:", err);
            }
        }

        let executionId: string | undefined;
        if (activeWorkflowId) {
            try {
                const execRes = await fetch('/api/executions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workflowId: activeWorkflowId,
                        scope: 'single',
                        nodeCount: 1
                    })
                });
                const execData = await execRes.json();
                executionId = execData.id;
            } catch (err) {
                console.error("Failed to initialize single node execution history:", err);
            }
        }

        try {
            const response = await fetch('/api/execute/node', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nodeId,
                    nodeType: node.type,
                    inputs: node.data,
                    executionId
                })
            });
            const res = await response.json();
            updateNodeData(nodeId, { executing: false, result: res.output || res.error });
        } catch (err) {
            updateNodeData(nodeId, { executing: false, result: "Execution failed" });
        } finally {
            set({ isRunning: false });
        }
    },
    runSelectedNodes: async (nodeIds: string[]) => {
        let { nodes, edges, activeWorkflowId, updateNodeData } = get();
        set({ isRunning: true });

        // Ensure workflow exists for history
        if (!activeWorkflowId) {
            try {
                const res = await fetch('/api/workflows', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: "Demo Workflow", nodes, edges })
                });
                const data = await res.json();
                activeWorkflowId = data.id;
                set({ activeWorkflowId });
            } catch (err) {
                console.error("Failed to save workflow for history:", err);
            }
        }

        let executionId: string | undefined;

        // Try to create an execution record if we have a workflowId
        if (activeWorkflowId) {
            try {
                const execRes = await fetch('/api/executions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workflowId: activeWorkflowId,
                        scope: nodeIds.length > 1 ? 'partial' : 'single',
                        nodeCount: nodeIds.length
                    })
                });
                const execData = await execRes.json();
                executionId = execData.id;
            } catch (err) {
                console.error("Failed to initialize selective execution history:", err);
            }
        }

        // Simple sequential execution for selected nodes
        for (const nodeId of nodeIds) {
            const node = nodes.find((n: Node) => n.id === nodeId);
            if (!node) continue;

            updateNodeData(nodeId, { executing: true, result: null });
            try {
                const response = await fetch('/api/execute/node', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nodeId,
                        nodeType: node.type,
                        inputs: node.data,
                        executionId
                    })
                });
                const res = await response.json();
                updateNodeData(nodeId, { executing: false, result: res.output || res.error });
            } catch (err) {
                updateNodeData(nodeId, { executing: false, result: "Execution failed" });
            }
        }
        set({ isRunning: false });
    }
}));
