"use client";

import React, { useCallback, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    Connection,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/store/workflowStore';
import { isValidConnection } from '@/lib/connectionValidator';
import TextNode from '../nodes/TextNode';
import LLMNode from '../nodes/LLMNode';
import UploadImageNode from '../nodes/UploadImageNode';
import UploadVideoNode from '../nodes/UploadVideoNode';
import CropImageNode from '../nodes/CropImageNode';
import ExtractFrameNode from '../nodes/ExtractFrameNode';
import ContextMenu from './ContextMenu';

const nodeTypes = {
    text: TextNode,
    llm: LLMNode,
    image: UploadImageNode,
    video: UploadVideoNode,
    crop: CropImageNode,
    frame: ExtractFrameNode,
};

export default function WorkflowCanvas() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect: storeOnConnect,
        runSingleNode,
        runSelectedNodes
    } = useWorkflowStore();

    const [menu, setMenu] = useState<{ x: number; y: number; nodeId?: string } | null>(null);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = { x: event.clientX - 250, y: event.clientY - 100 };
            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: { label: `${type} node` },
            };

            useWorkflowStore.getState().addNode(newNode);
        },
        []
    );

    // Wrap onConnect with validation
    const onConnect = useCallback((connection: Connection) => {
        const { getConnectionError } = require('@/lib/connectionValidator');
        const error = getConnectionError(connection, nodes, edges);

        if (!error) {
            storeOnConnect(connection);
        } else {
            alert(error);
        }
    }, [nodes, edges, storeOnConnect]);

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();
            setMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
        },
        [setMenu]
    );

    const onPaneContextMenu = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            setMenu({ x: event.clientX, y: event.clientY });
        },
        [setMenu]
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    const handleRunNode = useCallback(() => {
        if (menu?.nodeId) {
            runSingleNode(menu.nodeId);
        }
    }, [menu, runSingleNode]);

    const handleRunSelected = useCallback(() => {
        const selectedNodes = nodes.filter((n) => n.selected).map((n) => n.id);
        if (selectedNodes.length > 0) {
            runSelectedNodes(selectedNodes);
        }
    }, [nodes, runSelectedNodes]);

    return (
        <div className="flex-1 h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeContextMenu={onNodeContextMenu}
                onPaneContextMenu={onPaneContextMenu}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#111" gap={20} />
                <Controls className="bg-[#1a1a1a] border-gray-800 fill-white" />
                <MiniMap
                    style={{ backgroundColor: '#1a1a1a' }}
                    maskColor="rgba(0, 0, 0, 0.7)"
                    nodeColor={(n) => {
                        if (n.type === 'text') return '#eab308';
                        if (n.type === 'llm') return '#8b5cf6';
                        if (n.type === 'image') return '#3b82f6';
                        if (n.type === 'video') return '#22c55e';
                        return '#475569';
                    }}
                />
            </ReactFlow>

            {menu && (
                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    selectedCount={nodes.filter(n => n.selected).length}
                    onRunNode={handleRunNode}
                    onRunSelected={handleRunSelected}
                    onClose={() => setMenu(null)}
                />
            )}
        </div>
    );
}
