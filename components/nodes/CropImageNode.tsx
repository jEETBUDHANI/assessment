"use client";

import React from 'react';
import { Crop } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeProps } from 'reactflow';

export default function CropImageNode({ id, data, selected }: NodeProps) {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            icon={Crop}
            iconColor="bg-pink-500"
            title="Crop Image"
            inputs={[
                { id: 'image_url', label: 'Image URL' },
                { id: 'x_percent', label: 'X %' },
                { id: 'y_percent', label: 'Y %' },
                { id: 'width_percent', label: 'Width %' },
                { id: 'height_percent', label: 'Height %' },
            ]}
            outputs={[{ id: 'output', label: 'Cropped' }]}
        >
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 uppercase">X (%)</label>
                        <input
                            type="number"
                            className="bg-black border border-gray-800 rounded p-1 text-xs text-gray-300"
                            placeholder="0"
                            defaultValue={0}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 uppercase">Y (%)</label>
                        <input
                            type="number"
                            className="bg-black border border-gray-800 rounded p-1 text-xs text-gray-300"
                            placeholder="0"
                            defaultValue={0}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 uppercase">Width (%)</label>
                        <input
                            type="number"
                            className="bg-black border border-gray-800 rounded p-1 text-xs text-gray-300"
                            placeholder="100"
                            defaultValue={100}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 uppercase">Height (%)</label>
                        <input
                            type="number"
                            className="bg-black border border-gray-800 rounded p-1 text-xs text-gray-300"
                            placeholder="100"
                            defaultValue={100}
                        />
                    </div>
                </div>
            </div>
        </BaseNode>
    );
}
