"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeProps } from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';

export default function LLMNode({ id, data, selected }: NodeProps) {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            icon={Sparkles}
            iconColor="bg-violet-500"
            title="LLM"
            inputs={[
                { id: 'system_prompt', label: 'System' },
                { id: 'user_message', label: 'Message' },
                { id: 'images', label: 'Images' },
            ]}
            outputs={[{ id: 'output', label: 'Response' }]}
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">Model</label>
                    <select className="bg-black border border-gray-800 rounded p-1 text-xs text-gray-300">
                        <option>Gemini 1.5 Pro</option>
                        <option>Gemini 1.5 Flash</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">System Prompt</label>
                    <textarea
                        className="nodrag bg-black border border-gray-800 rounded p-2 text-xs text-gray-300 min-h-[60px] resize-none focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="System instructions..."
                        value={data?.system_prompt || ''}
                        onChange={(e) => {
                            useWorkflowStore.getState().updateNodeData(id, { system_prompt: e.target.value });
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">User Message</label>
                    <textarea
                        className="nodrag bg-black border border-gray-800 rounded p-2 text-xs text-gray-300 min-h-[60px] resize-none focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="Your message..."
                        value={data?.user_message || ''}
                        onChange={(e) => {
                            useWorkflowStore.getState().updateNodeData(id, { user_message: e.target.value });
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        </BaseNode>
    );
}
