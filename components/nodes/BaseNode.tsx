import React from 'react';
import { Handle, Position } from 'reactflow';
import { LucideIcon, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowStore } from '@/store/workflowStore';

interface BaseNodeProps {
    id: string;
    data: any;
    selected?: boolean;
    icon: LucideIcon;
    iconColor?: string;
    title: string;
    inputs?: Array<{ id: string; label: string; position?: Position }>;
    outputs?: Array<{ id: string; label: string; position?: Position }>;
    children: React.ReactNode;
}

export default function BaseNode({
    id,
    data,
    selected,
    icon: Icon,
    iconColor = "bg-yellow-500",
    title,
    inputs = [],
    outputs = [],
    children
}: BaseNodeProps) {
    const { runSingleNode } = useWorkflowStore();
    const executing = data?.executing || false;

    const handleRunNode = (e: React.MouseEvent) => {
        e.stopPropagation();
        runSingleNode(id);
    };

    return (
        <div className={cn(
            "min-w-[280px] bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all",
            "bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:20px_20px]",
            selected && "ring-2 ring-cyan-500 border-cyan-500",
            executing && "executing-node ring-2 ring-violet-500 animate-pulse"
        )}>
            {/* Input Handles */}
            {inputs.map((input, idx) => (
                <Handle
                    key={input.id}
                    type="target"
                    position={input.position || Position.Left}
                    id={input.id}
                    style={{
                        top: `${((idx + 1) * 100) / (inputs.length + 1)}%`,
                        background: '#06b6d4',
                        width: '10px',
                        height: '10px',
                        border: '2px solid #000'
                    }}
                />
            ))}

            {/* Header */}
            <div className="bg-black/40 px-3 py-2.5 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded", iconColor)}>
                        <Icon size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">{title}</span>
                </div>
                <button
                    onClick={handleRunNode}
                    disabled={executing}
                    className="p-1 hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
                    title="Run this node"
                >
                    <Play size={12} className="text-gray-400" fill="currentColor" />
                </button>
            </div>

            {/* Content */}
            <div className="p-3">
                {children}

                {data?.result && (
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-black/40 rounded border border-gray-800">
                        <div className="font-medium text-gray-400 mb-1">Result:</div>
                        <div className="break-all">{data.result}</div>
                    </div>
                )}
            </div>

            {/* Output Handles */}
            {outputs.map((output, idx) => (
                <Handle
                    key={output.id}
                    type="source"
                    position={output.position || Position.Right}
                    id={output.id}
                    style={{
                        top: `${((idx + 1) * 100) / (outputs.length + 1)}%`,
                        background: '#06b6d4',
                        width: '10px',
                        height: '10px',
                        border: '2px solid #000'
                    }}
                />
            ))}
        </div>
    );
}
