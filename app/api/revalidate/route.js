// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { tag } = await request.json();

        if (!tag) {
            return NextResponse.json(
                { message: 'Tag parameter is required', success: false },
                { status: 400 }
            );
        }

        revalidateTag(tag);

        return NextResponse.json(
            { revalidated: true, message: `Revalidated ${tag}`, success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error revalidating', success: false },
            { status: 500 }
        );
    }
}