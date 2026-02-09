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
    updateNodeData: (nodeId: string, data: any) => void;
    setRunning: (isRunning: boolean) => void;
    runSingleNode: (nodeId: string) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: [],
    edges: [],
    isRunning: false,
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
            edges: addEdge({ ...connection, animated: true, style: { stroke: '#8b5cf6' } }, get().edges),
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
    setRunning: (isRunning: boolean) => set({ isRunning }),
    runSingleNode: async (nodeId: string) => {
        const { nodes, updateNodeData } = get();
        const node = nodes.find((n: Node) => n.id === nodeId);
        if (!node) return;

        set({ isRunning: true });
        updateNodeData(nodeId, { executing: true, result: null });

        try {
            const response = await fetch('/api/execute/node', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodeId, nodeType: node.type, inputs: node.data })
            });
            const res = await response.json();
            updateNodeData(nodeId, { executing: false, result: res.output || res.error });
        } catch (err) {
            updateNodeData(nodeId, { executing: false, result: "Execution failed" });
        } finally {
            set({ isRunning: false });
        }
    }
}));
