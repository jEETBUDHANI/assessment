import { Connection, Edge, Node } from 'reactflow';

// Define explicit types for node definitions
interface NodeDefinition {
    inputs?: Record<string, string[]>;
    outputs: string[];
}

// Define node type categories and their allowed input/output types
const NODE_TYPE_DEFINITIONS: Record<string, NodeDefinition> = {
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

    if (!sourceNode || !targetNode || !sourceNode.type || !targetNode.type) return false;

    // Get node type definitions
    const sourceTypeDef = NODE_TYPE_DEFINITIONS[sourceNode.type];
    const targetTypeDef = NODE_TYPE_DEFINITIONS[targetNode.type];

    if (!sourceTypeDef || !targetTypeDef) return false;

    // Get output type from source
    const sourceOutputTypes = sourceTypeDef.outputs || [];

    // Get input type requirements from target
    const targetInputs = targetTypeDef.inputs;

    // If target has no inputs defined, it cannot accept connections
    if (!targetInputs) return false;

    const targetInputTypes = targetInputs[targetHandle];

    // If the specific handle doesn't exist in inputs
    if (!targetInputTypes) return false;

    // Check if any source output type matches any target input type
    const isCompatible = sourceOutputTypes.some(outputType =>
        // @ts-ignore
        targetInputTypes.includes(outputType)
    );

    if (!isCompatible) {
        const errorMsg = `Invalid connection: ${sourceNode.type} outputs ${sourceOutputTypes.join(', ')}, but ${targetNode.type}.${targetHandle} requires ${targetInputTypes.join(', ')}.`;
        console.warn(errorMsg);
        // Instead of relying on the calling component to alert, we could return the error string
        // but for now, we'll keep the boolean return and let the UI handle the alert.
    }

    return isCompatible;
}

export function getConnectionError(
    connection: Connection,
    nodes: Node[],
    edges: Edge[]
): string | null {
    const { source, target, sourceHandle, targetHandle } = connection;

    if (!source || !target) return "Invalid source or target";

    const sourceNode = nodes.find(n => n.id === source);
    const targetNode = nodes.find(n => n.id === target);

    if (!sourceNode || !targetNode) return "Node not found";
    if (!sourceNode.type || !targetNode.type) return "Invalid node types";

    const sourceTypeDef = NODE_TYPE_DEFINITIONS[sourceNode.type];
    const targetTypeDef = NODE_TYPE_DEFINITIONS[targetNode.type];

    if (!sourceTypeDef) return `No definitions for source type: ${sourceNode.type}`;
    if (!targetTypeDef) return `No definitions for target type: ${targetNode.type}`;

    if (!targetTypeDef.inputs) return `${targetNode.type} does not accept any inputs`;
    if (!targetHandle) return "No target handle selected. Make sure to drop the line directly on a handle.";

    const targetInputTypes = targetTypeDef.inputs[targetHandle];
    if (!targetInputTypes) return `Invalid input handle: ${targetHandle} on ${targetNode.type}`;

    const sourceOutputTypes = sourceTypeDef.outputs || [];
    const isCompatible = sourceOutputTypes.some(outputType =>
        // @ts-ignore
        targetInputTypes.includes(outputType)
    );

    if (!isCompatible) {
        return `Incompatible types: ${sourceNode.type} outputs [${sourceOutputTypes.join(', ')}], but ${targetNode.type} ${targetHandle} only accepts [${targetInputTypes.join(', ')}]`;
    }

    return null;
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
