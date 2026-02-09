"use client";

import React, { useState } from 'react';
import BaseNode from './BaseNode';
import { Upload, Video as VideoIcon } from 'lucide-react';

interface UploadVideoNodeProps {
    id: string;
    data: any;
    selected?: boolean;
}

export default function UploadVideoNode({ id, data, selected }: UploadVideoNodeProps) {
    const [uploading, setUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(data.videoUrl || null);

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
            setVideoUrl(url);

            // Update node data
            const store = await import('@/store/workflowStore');
            store.useWorkflowStore.getState().updateNodeData(id, { videoUrl: url });

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
            icon={VideoIcon}
            iconColor="bg-green-500"
            title="Upload Video"
            outputs={[{ id: 'output', label: 'Video URL' }]}
        >
            <div className="space-y-2">
                <label className="block">
                    <input
                        type="file"
                        accept="video/mp4,video/mov,video/webm,video/m4v"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                        id={`file-${id}`}
                    />
                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded cursor-pointer transition-colors">
                        <Upload size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-300">
                            {uploading ? 'Uploading...' : 'Choose Video'}
                        </span>
                    </div>
                </label>

                {videoUrl && (
                    <div className="mt-2 rounded overflow-hidden border border-gray-700">
                        <video
                            src={videoUrl}
                            controls
                            className="w-full h-32"
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
