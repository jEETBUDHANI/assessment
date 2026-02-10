import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { nodeId, nodeType, inputs, executionId } = await req.json();

        // This is where we would trigger actual Trigger.dev tasks
        console.log(`API Target: Execute ${nodeType} (${nodeId}) with`, inputs);

        // Simulation logic
        const startTime = new Date();
        await new Promise(resolve => setTimeout(resolve, 2000));
        const duration = 2000;

        let output = "Simulated results";
        if (nodeType === 'text') {
            output = inputs.value || "Default prompt text";
        } else if (nodeType === 'llm') {
            const msg = (inputs.user_message || "").toLowerCase();
            const system = (inputs.system_prompt || "").toLowerCase();
            const combined = msg + " " + system;

            if (combined.includes("analyze") || combined.includes("describe") || combined.includes("what is")) {
                output = "Based on the visual data provided, I can see a professional workspace with modern design elements. The composition suggests high-quality production values and a clean, efficient aesthetic.";
            } else if (combined.includes("social media") || combined.includes("post") || combined.includes("catchy")) {
                output = "🚀 Exciting News! Our AI Workflow Builder just reached a major milestone. Check out how easy it is to chain complex tasks into one seamless automation. #AI #NoCode #Innovation";
            } else if (combined.includes("hello") || combined.includes("hi")) {
                output = "Hello! I'm your AI assistant. I'm connected to your workflow and ready to help you process text, images, or video. What can we build today?";
            } else {
                output = `I've processed your request using the provided instructions (${inputs.system_prompt || 'Standard Model'}). I am ready to continue with the next step in your workflow.`;
            }
        } else if (nodeType === 'image') {
            output = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format";
        } else if (nodeType === 'video') {
            output = "https://www.w3schools.com/html/mov_bbb.mp4";
        } else if (nodeType === 'image') {
            output = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format";
        } else if (nodeType === 'video') {
            output = "https://www.w3schools.com/html/mov_bbb.mp4";
        } else if (nodeType === 'crop') {
            output = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&crop=entropy";
        } else if (nodeType === 'frame') {
            output = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=300&auto=format";
        }

        // PERSIST: If we have an executionId, save the node run
        if (executionId) {
            await prisma.nodeExecution.create({
                data: {
                    workflowExecutionId: executionId,
                    nodeId,
                    nodeType,
                    status: 'success',
                    startTime,
                    endTime: new Date(),
                    duration,
                    inputs: inputs as any,
                    outputs: { output } as any,
                }
            });
        }

        return NextResponse.json({
            success: true,
            output,
            duration
        });

    } catch (error: any) {
        console.error("Execution error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
