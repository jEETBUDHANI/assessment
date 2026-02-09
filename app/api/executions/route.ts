import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = await auth();

        // Return empty array if not authenticated
        if (!userId) {
            return NextResponse.json([]);
        }

        const executions = await prisma.workflowExecution.findMany({
            where: { userId },
            include: {
                workflow: {
                    select: {
                        name: true
                    }
                },
                nodeRuns: {
                    orderBy: { startTime: 'asc' }
                }
            },
            orderBy: { startTime: 'desc' },
            take: 50 // Limit to last 50 executions
        });

        return NextResponse.json(executions);
    } catch (error: any) {
        console.error("Fetch executions error:", error);
        return NextResponse.json([]);
    }
}
