"use client";

import React, { useState } from 'react';
import {
    Search, Undo2, FolderOpen, Box, Image, Video,
    Sparkles, Type, Upload, Crop, Film
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarSections = [
    {
        id: 'quick-access',
        icon: Sparkles,
        label: 'Quick Access',
        nodes: [
            { id: 'text', label: 'Prompt', icon: Type, color: 'bg-yellow-500' },
            { id: 'image', label: 'Import', icon: Upload, color: 'bg-blue-500' },
        ]
    },
    {
        id: 'toolbox',
        icon: Box,
        label: 'Toolbox',
        nodes: [
            { id: 'crop', label: 'Crop', icon: Crop, color: 'bg-purple-500' },
            { id: 'frame', label: 'Extract Frame', icon: Film, color: 'bg-pink-500' },
        ]
    },
    {
        id: 'image-models',
        icon: Image,
        label: 'Image Models',
        nodes: [
            { id: 'llm', label: 'Run Any LLM', icon: Sparkles, color: 'bg-violet-500' },
        ]
    },
    {
        id: 'video-models',
        icon: Video,
        label: 'Video Models',
        nodes: [
            { id: 'video', label: 'Upload Video', icon: Upload, color: 'bg-green-500' },
        ]
    },
];

export default function IconSidebar() {
    const [activeSection, setActiveSection] = useState<string | null>('quick-access');

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <>
            {/* Icon-only narrow sidebar */}
            <aside className="w-12 bg-black border-r border-gray-800 flex flex-col items-center py-4 gap-4">
                <button
                    onClick={() => alert("Search: Looking for nodes or previous runs...")}
                    className="p-2 hover:bg-gray-800 rounded-md transition-colors"
                >
                    <Search size={20} className="text-gray-400" />
                </button>
                <button
                    onClick={() => alert("Undo: Last action reverted! 🔄")}
                    className="p-2 hover:bg-gray-800 rounded-md transition-colors"
                >
                    <Undo2 size={20} className="text-gray-400" />
                </button>
                <button
                    onClick={() => alert("File Explorer: Opening your saved workflows...")}
                    className="p-2 hover:bg-gray-800 rounded-md transition-colors"
                >
                    <FolderOpen size={20} className="text-gray-400" />
                </button>

                <div className="h-px w-8 bg-gray-800 my-2" />

                {sidebarSections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        className={cn(
                            "p-2 rounded-md transition-colors",
                            activeSection === section.id ? "bg-yellow-500/20 text-yellow-500" : "hover:bg-gray-800 text-gray-400"
                        )}
                    >
                        <section.icon size={20} />
                    </button>
                ))}
            </aside>

            {/* Expandable panel for node types */}
            {activeSection && (
                <aside className="w-56 bg-[#0a0a0a] border-r border-gray-800 flex flex-col">
                    <div className="p-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-black border border-gray-800 rounded-md px-3 py-1.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-700"
                        />
                    </div>

                    {sidebarSections
                        .filter(section => section.id === activeSection)
                        .map((section) => (
                            <div key={section.id} className="flex-1 overflow-y-auto">
                                <div className="px-4 py-2">
                                    <h3 className="text-sm font-semibold text-white mb-3">{section.label}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {section.nodes.map((node) => (
                                            <button
                                                key={node.id}
                                                draggable
                                                onDragStart={(e) => onDragStart(e, node.id)}
                                                className="flex flex-col items-center gap-2 p-3 bg-black border border-gray-800 rounded-lg hover:border-gray-700 transition-colors cursor-grab active:cursor-grabbing"
                                            >
                                                <div className={cn("p-2 rounded", node.color)}>
                                                    <node.icon size={16} className="text-white" />
                                                </div>
                                                <span className="text-xs text-gray-300 text-center">{node.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                </aside>
            )}
        </>
    );
}
