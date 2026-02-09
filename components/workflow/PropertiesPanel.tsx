"use client";

import React from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { X, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PropertiesPanel() {
    const { nodes } = useWorkflowStore();
    const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

    const selectedNode = nodes.find(n => n.selected);

    React.useEffect(() => {
        if (selectedNode) {
            setSelectedNodeId(selectedNode.id);
        } else {
            setSelectedNodeId(null);
        }
    }, [selectedNode]);

    if (!selectedNode) {
        return (
            <aside className="w-80 bg-[#0a0a0a] border-l border-gray-800 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-600 text-sm px-6">
                        <p className="mb-2">No node selected</p>
                        <p className="text-xs">Select a node to view its properties</p>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-80 bg-[#0a0a0a] border-l border-gray-800 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <h3 className="text-sm font-semibold text-white">{selectedNode.data.label || selectedNode.type}</h3>
                </div>
                <button
                    onClick={() => setSelectedNodeId(null)}
                    className="text-gray-500 hover:text-gray-300"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Properties */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedNode.type === 'llm' && (
                    <>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Model</label>
                            <select className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-700">
                                <option>Gemini 1.5 Pro</option>
                                <option>Gemini 1.5 Flash</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Temperature</label>
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                defaultValue="1"
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span>0</span>
                                <span>2</span>
                            </div>
                        </div>
                    </>
                )}

                {selectedNode.type === 'crop' && (
                    <>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">X Position (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                defaultValue="0"
                                className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Y Position (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                defaultValue="0"
                                className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Width (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                defaultValue="100"
                                className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Height (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                defaultValue="100"
                                className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-700"
                            />
                        </div>
                    </>
                )}

                {selectedNode.type === 'frame' && (
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Timestamp</label>
                        <input
                            type="text"
                            placeholder="e.g., 5s or 50%"
                            defaultValue="0"
                            className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-700"
                        />
                        <p className="text-xs text-gray-600 mt-1">Enter seconds (e.g., 5s) or percentage (e.g., 50%)</p>
                    </div>
                )}

                {selectedNode.data.result && (
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Result</label>
                        <div className="bg-black border border-gray-800 rounded-md p-3 text-xs text-gray-300">
                            {selectedNode.data.result}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - Run Button */}
            <div className="p-4 border-t border-gray-800">
                <button className="w-full bg-white hover:bg-gray-200 text-black font-medium py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
                    <Play size={14} fill="currentColor" />
                    Run selected
                </button>
                <div className="text-center text-xs text-gray-600 mt-2">
                    ★ 96 credits
                </div>
            </div>
        </aside>
    );
}
