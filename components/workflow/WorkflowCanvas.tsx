"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    Connection
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
        onConnect: storeOnConnect
    } = useWorkflowStore();

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
        if (isValidConnection(connection, nodes, edges)) {
            storeOnConnect(connection);
        } else {
            alert('Invalid connection: incompatible node types');
        }
    }, [nodes, edges, storeOnConnect]);

    return (
        <div className="flex-1 h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#334155" gap={20} />
                <Controls />
                <MiniMap
                    style={{ backgroundColor: '#1e293b' }}
                    maskColor="rgba(15, 23, 42, 0.6)"
                />
            </ReactFlow>
        </div>
    );
}
