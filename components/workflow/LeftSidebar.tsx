"use client";

import React, { useState } from 'react';
import {
    Type,
    Image as ImageIcon,
    Video,
    Cpu,
    Crop,
    Film,
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NODE_TYPES = [
    { id: 'text', icon: Type, label: 'Text Node', color: 'bg-blue-500' },
    { id: 'image', icon: ImageIcon, label: 'Upload Image', color: 'bg-green-500' },
    { id: 'video', icon: Video, label: 'Upload Video', color: 'bg-orange-500' },
    { id: 'llm', icon: Cpu, label: 'Run Any LLM', color: 'bg-violet-500' },
    { id: 'crop', icon: Crop, label: 'Crop Image', color: 'bg-pink-500' },
    { id: 'frame', icon: Film, label: 'Extract Frame', color: 'bg-cyan-500' },
];

export default function LeftSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [search, setSearch] = useState('');

    return (
        <aside className={cn(
            "bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 relative",
            collapsed ? "w-16" : "w-64"
        )}>
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-10 bg-slate-700 border border-slate-600 rounded-full p-1 z-10 hover:bg-slate-600"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className="p-4 flex flex-col gap-4">
                {!collapsed && (
                    <>
                        <h2 className="font-bold text-lg">Nodes</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search nodes..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className="flex flex-col gap-2 mt-4">
                    <p className={cn("text-xs font-semibold text-slate-500 uppercase px-2", collapsed && "hidden")}>Quick Access</p>
                    {NODE_TYPES.filter(n => n.label.toLowerCase().includes(search.toLowerCase())).map((node) => (
                        <button
                            key={node.id}
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.setData('application/reactflow', node.id);
                                event.dataTransfer.effectAllowed = 'move';
                            }}
                            className={cn(
                                "flex items-center gap-3 p-2 rounded-md hover:bg-slate-700 transition-colors text-sm group cursor-grab active:cursor-grabbing",
                                collapsed ? "justify-center" : "px-3"
                            )}
                            title={collapsed ? node.label : undefined}
                        >
                            <div className={cn("p-1.5 rounded", node.color)}>
                                <node.icon size={18} className="text-white" />
                            </div>
                            {!collapsed && <span>{node.label}</span>}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}
