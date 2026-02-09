"use client";

import React, { useState } from 'react';
import BaseNode from './BaseNode';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadImageNodeProps {
    id: string;
    data: any;
    selected?: boolean;
}

export default function UploadImageNode({ id, data, selected }: UploadImageNodeProps) {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(data.imageUrl || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            // In real implementation with Transloadit:
            // 1. Initialize Uppy with Transloadit plugin
            // 2. Upload file via Transloadit
            // 3. Get back the CDN URL

            // For now, create a local preview URL
            const url = URL.createObjectURL(file);
            setImageUrl(url);

            // Update node data
            const store = await import('@/store/workflowStore');
            store.useWorkflowStore.getState().updateNodeData(id, { imageUrl: url });

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            icon={ImageIcon}
            iconColor="bg-blue-500"
            title="Upload Image"
            outputs={[{ id: 'output', label: 'Image URL' }]}
        >
            <div className="space-y-2">
                <label className="block">
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                        id={`file-${id}`}
                    />
                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded cursor-pointer transition-colors">
                        <Upload size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-300">
                            {uploading ? 'Uploading...' : 'Choose Image'}
                        </span>
                    </div>
                </label>

                {imageUrl && (
                    <div className="mt-2 rounded overflow-hidden border border-gray-700">
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="w-full h-32 object-cover"
                        />
                    </div>
                )}

                {data.result && (
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-black/40 rounded">
                        <div className="font-medium text-gray-400 mb-1">Output:</div>
                        <div className="break-all">{data.result}</div>
                    </div>
                )}
            </div>
        </BaseNode>
    );
}
