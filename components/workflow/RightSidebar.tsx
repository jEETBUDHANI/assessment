"use client";

import React, { useEffect, useState } from 'react';
import { History, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowStore } from '@/store/workflowStore';

export default function RightSidebar() {
    const [workflows, setWorkflows] = useState<any[]>([]);
    const { setNodes, setEdges } = useWorkflowStore();

    const fetchWorkflows = async () => {
        try {
            const res = await fetch('/api/workflows');
            const data = await res.json();
            setWorkflows(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch workflows", err);
            setWorkflows([]);
        }
    };

    useEffect(() => {
        fetchWorkflows();
        // Refresh every minute
        const interval = setInterval(fetchWorkflows, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadWorkflow = (wf: any) => {
        setNodes(wf.nodes);
        setEdges(wf.edges);
    };

    const deleteWorkflow = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure?")) return;

        try {
            await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
            fetchWorkflows();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <aside className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                <History className="text-violet-400" size={18} />
                <h2 className="font-bold text-lg">Workflow History</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {workflows.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm">
                        No workflows saved yet.
                    </div>
                ) : (
                    workflows.map((wf) => (
                        <div
                            key={wf.id}
                            onClick={() => loadWorkflow(wf)}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-violet-500/50 cursor-pointer transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm font-semibold text-slate-200 truncate pr-4">{wf.name}</h3>
                                <button
                                    onClick={(e) => deleteWorkflow(wf.id, e)}
                                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <Clock size={10} />
                                <span>{new Date(wf.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2">Build Info</div>
                <p className="text-[10px] text-slate-500">v1.0.0-assessment</p>
            </div>
        </aside>
    );
}
