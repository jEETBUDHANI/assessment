import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json([]);

        const executions = await prisma.workflowExecution.findMany({
            where: { userId },
            include: {
                workflow: { select: { name: true } },
                nodeRuns: { orderBy: { startTime: 'asc' } }
            },
            orderBy: { startTime: 'desc' },
            take: 50
        });

        return NextResponse.json(executions);
    } catch (error: any) {
        console.error("Fetch executions error:", error);
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { workflowId, scope, nodeCount } = await req.json();

        // If workflowId is 'temporary', we might need to create a temporary workflow first
        // But for this demo, we expect a real workflowId from the store (saved on Run)

        const execution = await prisma.workflowExecution.create({
            data: {
                userId,
                workflowId,
                scope,
                status: 'running',
                startTime: new Date(),
            }
        });

        return NextResponse.json(execution);
    } catch (error: any) {
        console.error("Create execution error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
