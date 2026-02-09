import { Node, Edge } from 'reactflow';

export const sampleWorkflow: { nodes: Node[]; edges: Edge[] } = {
    nodes: [
        // Branch A: Image Processing
        {
            id: 'img-1',
            type: 'image',
            position: { x: 50, y: 50 },
            data: { imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format' },
        },
        {
            id: 'crop-1',
            type: 'crop',
            position: { x: 300, y: 50 },
            data: { xPercent: 10, yPercent: 10, widthPercent: 80, heightPercent: 80 },
        },
        {
            id: 'txt-1',
            type: 'text',
            position: { x: 50, y: 250 },
            data: { value: 'Professional marketing copywriter instructions.' },
        },
        {
            id: 'txt-2',
            type: 'text',
            position: { x: 50, y: 400 },
            data: { value: 'Product: Premium Wireless Headphones.' },
        },
        {
            id: 'llm-1',
            type: 'llm',
            position: { x: 550, y: 150 },
            data: { model: 'gemini-1.5-pro' },
        },

        // Branch B: Video Processing
        {
            id: 'vid-1',
            type: 'video',
            position: { x: 50, y: 600 },
            data: { videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        },
        {
            id: 'frame-1',
            type: 'frame',
            position: { x: 300, y: 600 },
            data: { timestamp: '50%' },
        },

        // Convergence Point
        {
            id: 'llm-2',
            type: 'llm',
            position: { x: 850, y: 350 },
            data: { model: 'gemini-1.5-pro' },
        },
    ],
    edges: [
        // Branch A
        { id: 'e1', source: 'img-1', target: 'crop-1', sourceHandle: 'output', targetHandle: 'image_url', animated: true },
        { id: 'e2', source: 'txt-1', target: 'llm-1', sourceHandle: 'output', targetHandle: 'system_prompt', animated: true },
        { id: 'e3', source: 'txt-2', target: 'llm-1', sourceHandle: 'output', targetHandle: 'user_message', animated: true },
        { id: 'e4', source: 'crop-1', target: 'llm-1', sourceHandle: 'output', targetHandle: 'images', animated: true },

        // Branch B
        { id: 'e5', source: 'vid-1', target: 'frame-1', sourceHandle: 'output', targetHandle: 'video_url', animated: true },

        // Convergence
        { id: 'e6', source: 'llm-1', target: 'llm-2', sourceHandle: 'output', targetHandle: 'user_message', animated: true },
        { id: 'e7', source: 'crop-1', target: 'llm-2', sourceHandle: 'output', targetHandle: 'images', animated: true },
        { id: 'e8', source: 'frame-1', target: 'llm-2', sourceHandle: 'output', targetHandle: 'images', animated: true },
    ],
};
