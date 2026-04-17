import { NextResponse } from 'next/server';
import { readData } from '@/utils/common';
import crypto from "crypto"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const choice = searchParams.get('choice');

        const data = await readData();
        let response = { success: true };

        if (!choice) {
            response = data;
            response.success = true;
        } else {
            if (choice.includes('projects')) {
                response.projects = data.projects;
            }
            if (choice.includes('skills')) {
                response.skills = data.skills;
            }
            if (choice.includes('resume')) {
                response.resumeDocId = data.resumeDocId;
            }
            if (choice.includes('profile')) {
                response.profile = data.profile;
            }
            if (choice.includes('experience')) {
                response.experience = data.experience;
            }
        }
        const etag = crypto.createHash('md5').update(JSON.stringify(response)).digest('hex');

        const ifNoneMatch = request.headers.get('if-none-match');
        if (ifNoneMatch === etag) {
            // Data hasn't changed; respond with 304 Not Modified
            return NextResponse.json(null, { status: 304 });
        }

        const headers = new Headers();
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate'); // Allows revalidation
        headers.set('ETag', etag); // Unique identifier for the data

        return NextResponse.json(response, { status: 200, headers });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching data', success: false }, { status: 500 });
    }
}
