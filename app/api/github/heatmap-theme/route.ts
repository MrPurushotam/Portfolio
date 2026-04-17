import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { readData, writeData } from '../../../../utils/common';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { theme } = body;
        if (!theme) {
            return NextResponse.json({ message: "Theme is required", success: false }, { status: 401 });
        }
        const data = await readData();
        data.githubHeatmapTheme = theme;

        await writeData(data);
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        revalidateTag('githubHeatmapTheme', 'max');

        return NextResponse.json({ message: "Github Heatmap Theme updated successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while updating theme:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}
