"use client";

import React from 'react';
import { Type } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeProps } from 'reactflow';

export default function TextNode({ id, data, selected }: NodeProps) {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            icon={Type}
            iconColor="bg-yellow-500"
            title="Text"
            outputs={[{ id: 'output', label: 'Text' }]}
        >
            <div className="flex flex-col gap-2">
                <textarea
                    className="bg-black border border-gray-800 rounded p-2 text-xs text-gray-300 min-h-[80px] resize-none"
                    placeholder="Enter your text here..."
                    defaultValue={data?.text || ''}
                />
            </div>
        </BaseNode>
    );
}
