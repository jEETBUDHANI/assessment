import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = await auth();

        // Return empty array if not authenticated (user hasn't signed in yet)
        if (!userId) {
            return NextResponse.json([]);
        }

        const workflows = await prisma.workflow.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(workflows);
    } catch (error: any) {
        console.error("Fetch workflows error:", error);
        // Return empty array on error instead of 500
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { name, nodes, edges } = await req.json();

        const workflow = await prisma.workflow.create({
            data: {
                userId,
                name: name || "Untitled Workflow",
                nodes: nodes || [],
                edges: edges || [],
            }
        });

        return NextResponse.json(workflow);
    } catch (error: any) {
        console.error("Create workflow error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
