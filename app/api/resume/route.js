import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readData, writeData } from '../../../utils/common';
import { revalidateTag } from 'next/cache';

export async function POST(req) {
    try {
        const body = await req.json();
        const { docId } = body;
        if (!docId) {
            return NextResponse.json({ message: "DocId is important.", success: false }, { status: 401 });
        }
        const data = await readData();
        data.resumeDocId = docId;

        await writeData(data);
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        
        // Revalidate the cache
        revalidateTag('resume');

        return NextResponse.json({ message: "Resume Doc Id added successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while adding project:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}
