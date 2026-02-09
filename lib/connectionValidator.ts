import { Connection, Edge, Node } from 'reactflow';

// Define node type categories and their allowed input/output types
const NODE_TYPE_DEFINITIONS = {
    text: {
        outputs: ['text']
    },
    image: {
        outputs: ['image']
    },
    video: {
        outputs: ['video']
    },
    llm: {
        inputs: {
            system_prompt: ['text'],
            user_message: ['text'],
            images: ['image']
        },
        outputs: ['text']
    },
    crop: {
        inputs: {
            image_url: ['image'],
            x_percent: ['text'],
            y_percent: ['text'],
            width_percent: ['text'],
            height_percent: ['text']
        },
        outputs: ['image']
    },
    frame: {
        inputs: {
            video_url: ['video'],
            timestamp: ['text']
        },
        outputs: ['image']
    }
};

export function isValidConnection(
    connection: Connection,
    nodes: Node[],
    edges: Edge[]
): boolean {
    const { source, target, sourceHandle, targetHandle } = connection;

    if (!source || !target || !targetHandle) return false;

    // Find source and target nodes
    const sourceNode = nodes.find(n => n.id === source);
    const targetNode = nodes.find(n => n.id === target);

    if (!sourceNode || !targetNode) return false;

    // Get node type definitions
    const sourceTypeDef = NODE_TYPE_DEFINITIONS[sourceNode.type as keyof typeof NODE_TYPE_DEFINITIONS];
    const targetTypeDef = NODE_TYPE_DEFINITIONS[targetNode.type as keyof typeof NODE_TYPE_DEFINITIONS];

    if (!sourceTypeDef || !targetTypeDef) return false;

    // Get output type from source
    const sourceOutputTypes = sourceTypeDef.outputs || [];

    // Get input type requirements from target
    const targetInputs = targetTypeDef.inputs;
    if (!targetInputs) return false;

    const targetInputTypes = targetInputs[targetHandle as keyof typeof targetInputs];
    if (!targetInputTypes) return false;

    // Check if any source output type matches any target input type
    const isCompatible = sourceOutputTypes.some(outputType =>
        targetInputTypes.includes(outputType)
    );

    if (!isCompatible) {
        console.warn(
            `Invalid connection: ${sourceNode.type} (outputs: ${sourceOutputTypes.join(', ')}) ` +
            `cannot connect to ${targetNode.type}.${targetHandle} (accepts: ${targetInputTypes.join(', ')})`
        );
    }

    return isCompatible;
}

// Helper to check if a connection already exists to a target handle
export function hasExistingConnection(
    targetNode: string,
    targetHandle: string,
    edges: Edge[]
): boolean {
    return edges.some(
        edge => edge.target === targetNode && edge.targetHandle === targetHandle
    );
}
