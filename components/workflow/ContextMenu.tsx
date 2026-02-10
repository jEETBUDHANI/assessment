"use client";

import React from 'react';
import { Play, PlayCircle } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    onRunNode?: () => void;
    onRunSelected?: () => void;
    onClose: () => void;
    selectedCount: number;
}

export default function ContextMenu({
    x, y, onRunNode, onRunSelected, onClose, selectedCount
}: ContextMenuProps) {
    return (
        <div
            className="fixed z-50 bg-[#1a1a1a] border border-gray-800 rounded-md shadow-xl py-1 w-48 text-sm text-gray-300"
            style={{ top: y, left: x }}
            onMouseLeave={onClose}
        >
            {selectedCount <= 1 && onRunNode && (
                <button
                    onClick={(e) => { e.stopPropagation(); onRunNode(); onClose(); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center gap-2 transition-colors"
                >
                    <Play size={14} className="text-gray-400" />
                    <span>Run Node</span>
                </button>
            )}

            {selectedCount > 1 && onRunSelected && (
                <button
                    onClick={(e) => { e.stopPropagation(); onRunSelected(); onClose(); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center gap-2 transition-colors"
                >
                    <PlayCircle size={14} className="text-gray-400" />
                    <span>Run Selected Nodes</span>
                </button>
            )}

            <div className="h-px bg-gray-800 my-1" />

            <button
                onClick={onClose}
                className="w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
            >
                Cancel
            </button>
        </div>
    );
}
