"use client";

import React from 'react';
import { Film } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeProps } from 'reactflow';

export default function ExtractFrameNode({ id, data, selected }: NodeProps) {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            icon={Film}
            iconColor="bg-purple-500"
            title="Extract Frame"
            inputs={[
                { id: 'video_url', label: 'Video URL' },
                { id: 'timestamp', label: 'Timestamp' },
            ]}
            outputs={[{ id: 'output', label: 'Frame' }]}
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">Timestamp</label>
                    <input
                        type="text"
                        className="bg-black border border-gray-800 rounded p-1 text-xs text-gray-300"
                        placeholder="e.g., 5s or 50%"
                        defaultValue="0s"
                    />
                    <p className="text-[9px] text-gray-600">Enter seconds (e.g., 5s) or percentage (e.g., 50%)</p>
                </div>
            </div>
        </BaseNode>
    );
}
