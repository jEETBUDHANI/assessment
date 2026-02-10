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
        async function fetchExecutions() {
            try {
                const response = await fetch('/api/executions');
                if (!response.ok) {
                    setRuns([]);
                    return;
                }

                const data = await response.json();

                // Transform database data to component format
                const transformedRuns: WorkflowRun[] = data.map((execution: any) => ({
                    id: execution.id,
                    timestamp: execution.startTime,
                    status: execution.status,
                    duration: execution.duration ? `${(execution.duration / 1000).toFixed(1)}s` : undefined,
                    scope: execution.scope,
                    nodeCount: execution.nodeRuns.length,
                    nodeExecutions: execution.nodeRuns.map((node: any) => {
                        // Extract actual output string from {output: "..."}
                        const cleanOutput = node.outputs?.output || (node.outputs ? JSON.stringify(node.outputs) : undefined);
                        return {
                            nodeId: node.nodeId,
                            nodeName: node.nodeType,
                            status: node.status,
                            duration: node.duration ? `${(node.duration / 1000).toFixed(1)}s` : '0.0s',
                            output: cleanOutput,
                            error: node.error || undefined
                        };
                    })
                }));

                setRuns(transformedRuns);
            } catch (error) {
                console.error('Failed to fetch executions:', error);
                setRuns([]);
            }
        }

        fetchExecutions();
        // Poll for updates every 5 seconds for the demo
        const interval = setInterval(fetchExecutions, 5000);
        return () => clearInterval(interval);
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
                {runs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <Clock size={48} className="text-gray-700 mb-3" />
                        <p className="text-sm text-gray-400 mb-1">No workflow runs yet</p>
                        <p className="text-xs text-gray-600">Execute a workflow to see history here</p>
                    </div>
                ) : (
                    runs.map((run) => (
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
                                                <div className="mt-2 text-xs text-gray-300 bg-black/60 rounded-md border border-gray-800/50 px-3 py-2 leading-relaxed shadow-inner">
                                                    <span className="text-[10px] uppercase font-bold text-cyan-500/80 block mb-1">Output Log</span>
                                                    {node.output}
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
                    ))
                )}
            </div>
        </aside>
    );
}
