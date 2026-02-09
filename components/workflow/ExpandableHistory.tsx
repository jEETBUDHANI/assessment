"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowRun {
    id: string;
    timestamp: string;
    status: 'success' | 'failed' | 'running' | 'partial';
    duration?: string;
    scope: 'full' | 'partial' | 'single';
    nodeCount: number;
    nodeExecutions: Array<{
        nodeId: string;
        nodeName: string;
        status: 'success' | 'failed' | 'running';
        duration: string;
        output?: string;
        error?: string;
    }>;
}

export default function ExpandableHistory() {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [expandedRun, setExpandedRun] = useState<string | null>(null);

    useEffect(() => {
        // Mock data - in real app, fetch from API
        setRuns([
            {
                id: 'run-1',
                timestamp: new Date().toISOString(),
                status: 'success',
                duration: '12.5s',
                scope: 'full',
                nodeCount: 6,
                nodeExecutions: [
                    { nodeId: 'text-1', nodeName: 'Text Node', status: 'success', duration: '0.1s', output: 'System prompt text' },
                    { nodeId: 'image-1', nodeName: 'Upload Image', status: 'success', duration: '2.3s', output: 'https://cdn.transloadit.com/image.jpg' },
                    { nodeId: 'crop-1', nodeName: 'Crop Image', status: 'success', duration: '1.8s', output: 'https://cdn.transloadit.com/cropped.jpg' },
                    { nodeId: 'llm-1', nodeName: 'LLM Node', status: 'success', duration: '4.2s', output: 'Generated product description...' },
                    { nodeId: 'video-1', nodeName: 'Upload Video', status: 'success', duration: '3.1s', output: 'https://cdn.transloadit.com/video.mp4' },
                    { nodeId: 'frame-1', nodeName: 'Extract Frame', status: 'success', duration: '1.0s', output: 'https://cdn.transloadit.com/frame.jpg' },
                ]
            },
            {
                id: 'run-2',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                status: 'partial',
                duration: '8.3s',
                scope: 'partial',
                nodeCount: 2,
                nodeExecutions: [
                    { nodeId: 'crop-1', nodeName: 'Crop Image', status: 'success', duration: '1.5s', output: 'https://cdn.transloadit.com/cropped.jpg' },
                    { nodeId: 'llm-1', nodeName: 'LLM Node', status: 'failed', duration: '3.1s', error: 'API rate limit exceeded' },
                ]
            }
        ]);
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle size={14} className="text-green-500" />;
            case 'failed': return <XCircle size={14} className="text-red-500" />;
            case 'running': return <Loader size={14} className="text-yellow-500 animate-spin" />;
            default: return <Clock size={14} className="text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-green-500';
            case 'failed': return 'text-red-500';
            case 'running': return 'text-yellow-500';
            case 'partial': return 'text-orange-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <aside className="w-80 bg-[#0a0a0a] border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-white">Workflow History</h2>
                <p className="text-xs text-gray-500 mt-1">{runs.length} runs</p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {runs.map((run) => (
                    <div key={run.id} className="border-b border-gray-800">
                        <button
                            onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                            className="w-full p-3 hover:bg-gray-900/50 transition-colors text-left"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                    {expandedRun === run.id ? (
                                        <ChevronDown size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <ChevronRight size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(run.status)}
                                            <span className={cn("text-xs font-medium", getStatusColor(run.status))}>
                                                {run.scope === 'full' ? 'Full Workflow' : run.scope === 'partial' ? `${run.nodeCount} nodes` : 'Single Node'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {new Date(run.timestamp).toLocaleString()}
                                        </p>
                                        {run.duration && (
                                            <p className="text-xs text-gray-600 mt-0.5">{run.duration}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>

                        {expandedRun === run.id && (
                            <div className="px-3 pb-3 space-y-2 bg-black/20">
                                {run.nodeExecutions.map((node, idx) => (
                                    <div key={idx} className="pl-6 py-2 border-l-2 border-gray-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStatusIcon(node.status)}
                                            <span className="text-xs font-medium text-gray-300">{node.nodeName}</span>
                                            <span className="text-xs text-gray-600">{node.duration}</span>
                                        </div>
                                        {node.output && (
                                            <div className="mt-1 text-xs text-gray-500 bg-black/40 rounded px-2 py-1 break-all">
                                                <span className="text-gray-600">Output: </span>
                                                {node.output.length > 100 ? `${node.output.substring(0, 100)}...` : node.output}
                                            </div>
                                        )}
                                        {node.error && (
                                            <div className="mt-1 text-xs text-red-400 bg-red-950/20 rounded px-2 py-1">
                                                <span className="text-red-500">Error: </span>
                                                {node.error}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
}
