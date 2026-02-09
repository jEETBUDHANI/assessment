import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { nodeId, nodeType, inputs } = await req.json();

        // This is where we would trigger actual Trigger.dev tasks
        console.log(`API Target: Execute ${nodeType} (${nodeId}) with`, inputs);

        // Simulation logic (to be replaced by actual Trigger.dev task triggering)
        await new Promise(resolve => setTimeout(resolve, 2000));

        let output = "Simulated results";

        if (nodeType === 'text') {
            output = inputs.value || "";
        } else if (nodeType === 'llm') {
            output = "This is a simulated AI response combining " +
                (inputs.system_prompt || "no system prompt") + " and " +
                (inputs.user_message || "no user message");
        } else if (nodeType === 'crop') {
            output = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&crop=entropy";
        } else if (nodeType === 'frame') {
            output = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=300&auto=format";
        }

        return NextResponse.json({
            success: true,
            output,
            duration: 2000
        });

    } catch (error: any) {
        console.error("Execution error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
