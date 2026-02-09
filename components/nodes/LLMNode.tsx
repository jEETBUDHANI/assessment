"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeProps } from 'reactflow';

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
                        className="bg-black border border-gray-800 rounded p-2 text-xs text-gray-300 min-h-[60px] resize-none"
                        placeholder="System instructions..."
                        defaultValue={data?.systemPrompt || ''}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">User Message</label>
                    <textarea
                        className="bg-black border border-gray-800 rounded p-2 text-xs text-gray-300 min-h-[60px] resize-none"
                        placeholder="Your message..."
                        defaultValue={data?.userMessage || ''}
                    />
                </div>
            </div>
        </BaseNode>
    );
}
