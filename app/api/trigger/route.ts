import { NextResponse } from 'next/server';
import { client } from '@/lib/trigger';

export async function POST(req: Request) {
    try {
        const { eventName, payload } = await req.json();

        // Trigger the appropriate job
        const event = await client.sendEvent({
            name: eventName,
            payload,
        });

        return NextResponse.json({
            success: true,
            eventId: event.id
        });
    } catch (error: any) {
        console.error("Trigger.dev error:", error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}
