import { NextResponse } from "next/server";
import { readData, writeData } from '../../../utils/common';
import crypto from 'crypto';
import { revalidateTag } from 'next/cache';


export async function POST(req) {
    try {
        const body = await req.json();
        const { name, imagelink, type } = body;

        if (!name || !imagelink) {
            return NextResponse.json(
                { message: "Please fill required fields (name, imagelink).", success: false },
                { status: 401 }
            );
        }

        const newSkill = {
            id: Date.now(),
            name,
            imagelink,
            type
        };

        const data = await readData();
        data.skills.push(newSkill);

        await writeData(data);
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        
        // Revalidate the cache
        revalidateTag('skills');

        return NextResponse.json(
            { message: "Skill added successfully.", success: true, newSkill },
            { status: 200 , headers: { 'ETag': etag } }
        );
    } catch (error) {
        console.error("Error occurred while creating skill.", error.message);
        return NextResponse.json(
            { message: "Internal error occurred.", success: false },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, imagelink, type } = body;

        if (!id || !name || !imagelink || !type) {
            return NextResponse.json(
                { message: "Please provide all required fields (id, name, imagelink, type).", success: false },
                { status: 401 }
            );
        }

        const data = await readData();
        const skillIndex = data.skills.findIndex(skill => skill.id === id);

        if (skillIndex === -1) {
            return NextResponse.json(
                { message: "Invalid skill id.", success: false },
                { status: 403 }
            );
        }

        data.skills[skillIndex] = { ...data.skills[skillIndex], name, imagelink, type };

        await writeData(data);
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        
        // Revalidate the cache
        revalidateTag('skills');

        return NextResponse.json(
            { message: "Skill updated successfully.", updatedSkill: data.skills[skillIndex], success: true },
            { status: 200, headers: { 'ETag': etag } }
        );
    } catch (error) {
        console.error("Error occurred while updating skill.", error.message);
        return NextResponse.json(
            { message: "Internal error occurred.", success: false },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Invalid skill id.", success: false },
                { status: 401 }
            );
        }

        const data = await readData();
        data.skills = data.skills.filter(skill => skill.id !== id);

        await writeData(data);
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        
        // Revalidate the cache
        revalidateTag('skills');
        
        return NextResponse.json(
            { message: "Skill deleted successfully.", success: true },
            { status: 200 , headers: { 'ETag': etag } }
        );
    } catch (error) {
        console.error("Error occurred while deleting skill.", error.message);
        return NextResponse.json(
            { message: "Internal error occurred.", success: false },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        const data = await readData();
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        // Check for If-None-Match header
        const clientEtag = req.headers.get('If-None-Match');
        if (clientEtag === etag) {
            // If ETag matches, return 304 Not Modified
            return new Response(null, { status: 304 });
        }

        if (id) {
            const skill = data.skills.find(skill => skill.id === parseInt(id));
            if (!skill) {
                return NextResponse.json(
                    { message: "Skill not found.", success: false },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { skill, success: true },
                { status: 200, headers: { 'ETag': etag }, }
            );
        } else {
            return NextResponse.json(
                { skills: data.skills, success: true },
                { status: 200 , headers: { 'ETag': etag }, }
            );
        }
    } catch (error) {
        console.error("Error occurred while fetching skills.", error.message);
        return NextResponse.json(
            { message: "Internal error occurred.", success: false },
            { status: 500 }
        );
    }
}
