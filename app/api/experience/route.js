import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { Readable } from 'stream';
import { readData, writeData } from '../../../utils/common';
import crypto from 'crypto';
import cloudinary from '@/components/CloudinaryConfig';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const role = formData.get("role");
        const company = formData.get("company");
        const duration = formData.get('duration');
        const description = formData.get('description');
        const staticfile = formData.get('staticfile');
        const weburl = formData.get('weburl');
        let resourceType;

        if (!role || !company || !duration || !description) {
            return NextResponse.json({ message: "Please fill all the necessary fields.", success: false }, { status: 400 });
        }

        let uploadedFileUrl;

        if (staticfile && typeof staticfile === "object") {
            resourceType = staticfile.type.startsWith("video/") ? "video" : "image";
            const fileBuffer = Buffer.from(await staticfile.arrayBuffer());
            const fileStream = Readable.from(fileBuffer);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder: 'experience_static_media', resource_type: resourceType },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                fileStream.pipe(uploadStream);
            });
            uploadedFileUrl = result.secure_url;
        } else if (weburl) {
            try {
                let parsedUrl = weburl;
                if (!parsedUrl.startsWith("http")) {
                    parsedUrl = "https://" + parsedUrl;
                }
                const domain = new URL(parsedUrl).hostname;
                const faviconResponse = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
                const fileBuffer = Buffer.from(await faviconResponse.arrayBuffer());
                const fileStream = Readable.from(fileBuffer);
                resourceType = "image";
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.v2.uploader.upload_stream(
                        { folder: 'experience_static_media', resource_type: "image" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    fileStream.pipe(uploadStream);
                });
                uploadedFileUrl = result.secure_url;
            } catch (err) {
                console.error("Failed to fetch favicon:", err);
            }
        }

        const data = await readData();
        const newExperience = {
            id: Date.now(),
            role,
            company,
            duration,
            description,
            weburl: weburl || "",
            static_file: uploadedFileUrl || "",
            resourceType: resourceType || "",
        };
        console.log(newExperience);
        data.experience.push(newExperience);
        await writeData(data);

        revalidateTag('experience');
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        return NextResponse.json({ message: "Experience added successfully.", updatedExperience: newExperience, success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while adding experience:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const formData = await req.formData();
        const id = parseInt(formData.get("id"));
        const role = formData.get("role");
        const company = formData.get("company");
        const duration = formData.get('duration');
        const description = formData.get('description');
        const staticfile = formData.get('staticfile');
        const weburl = formData.get('weburl');
        let resourceType;

        if (!id) {
            return NextResponse.json({ message: "Id can't be null.", success: false }, { status: 400 });
        }

        const data = await readData();
        const experienceIndex = data.experience.findIndex(exp => exp.id === id);

        if (experienceIndex === -1) {
            return NextResponse.json({ message: "Invalid experience id.", success: false }, { status: 404 });
        }
        const experience = data.experience[experienceIndex];
        let newMediaUrl = experience.static_file;
        resourceType = experience.resourceType;

        if (staticfile) {
            resourceType = staticfile.type.startsWith("video/") ? "video" : "image";
            if (experience.static_file) {
                const publicId = experience.static_file.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`experience_static_media/${publicId}`);
            }
            const fileBuffer = Buffer.from(await staticfile.arrayBuffer());
            const fileStream = Readable.from(fileBuffer);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder: 'experience_static_media', resource_type: resourceType },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                fileStream.pipe(uploadStream);
            });

            newMediaUrl = result.secure_url;
        } else if (weburl && weburl !== experience.weburl) {
            try {
                let parsedUrl = weburl;
                if (!parsedUrl.startsWith("http")) {
                    parsedUrl = "https://" + parsedUrl;
                }
                const domain = new URL(parsedUrl).hostname;
                const faviconResponse = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
                const fileBuffer = Buffer.from(await faviconResponse.arrayBuffer());
                const fileStream = Readable.from(fileBuffer);
                resourceType = "image";

                if (experience.static_file && experience.static_file.includes("experience_static_media")) {
                    const publicId = experience.static_file.split('/').pop().split('.')[0];
                    await cloudinary.v2.uploader.destroy(
                        `experience_static_media/${publicId}`,
                        { resource_type: experience.resourceType || 'image' }
                    ).catch(e => console.log(e));
                }

                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.v2.uploader.upload_stream(
                        { folder: 'experience_static_media', resource_type: "image" },
                        (error, result) => (error ? reject(error) : resolve(result))
                    );
                    fileStream.pipe(uploadStream);
                });
                newMediaUrl = result.secure_url;
            } catch (err) {
                console.error("Failed to fetch favicon:", err);
            }
        } else if (experience.static_file && (staticfile === "" || (!weburl && experience.weburl))) {
            if (experience.static_file.includes("experience_static_media")) {
                const publicId = experience.static_file.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`experience_static_media/${publicId}`).catch(e => console.log(e));
            }
            newMediaUrl = "";
            resourceType = "";
        }

        const updatedExperience = {
            ...data.experience[experienceIndex],
            role: role || experience.role,
            company: company || experience.company,
            duration: duration || experience.duration,
            description: description || experience.description,
            weburl: weburl !== null ? weburl : experience.weburl,
            static_file: newMediaUrl,
            resourceType,
        };

        data.experience[experienceIndex] = updatedExperience;
        await writeData(data);

        revalidateTag('experience');
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        return NextResponse.json(
            { message: "Experience updated successfully.", updatedExperience, success: true },
            { status: 200, headers: { 'ETag': etag } }
        );
    } catch (error) {
        console.log("Error occurred while updating experience:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ message: "Id can't be null.", success: false }, { status: 400 });
        }

        const data = await readData();
        const experienceIndex = data.experience.findIndex(exp => exp.id === id);

        if (experienceIndex === -1) {
            return NextResponse.json({ message: "Experience not found", success: false }, { status: 404 });
        }

        const experience = data.experience[experienceIndex];
        if (experience.static_file) {
            const publicId = experience.static_file.split('/').pop().split('.')[0];
            try {
                await cloudinary.v2.uploader.destroy(
                    `experience_static_media/${publicId}`,
                    { resource_type: experience.resourceType || 'image' }
                );
            } catch (cloudinaryError) {
                console.error("Cloudinary deletion error:", cloudinaryError.message);
            }
        }
        data.experience.splice(experienceIndex, 1);
        await writeData(data);

        revalidateTag('experience');
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        return NextResponse.json({ message: "Experience deleted successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while deleting experience:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        const data = await readData();

        if (id) {
            const experience = data.experience.find(exp => parseInt(exp.id) === parseInt(id));
            if (!experience) {
                return NextResponse.json({ message: "Experience not found", success: false }, { status: 404 });
            }

            const etag = crypto.createHash('md5').update(JSON.stringify(experience)).digest('hex');
            const clientEtag = req.headers.get('If-None-Match');
            if (clientEtag === etag) {
                return new Response(null, { status: 304 });
            }

            return NextResponse.json({ experience, success: true }, { status: 200, headers: { 'ETag': etag }, });
        } else {
            const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
            const clientEtag = req.headers.get('If-None-Match');
            if (clientEtag === etag) {
                return new Response(null, { status: 304 });
            }

            return NextResponse.json({ experience: data.experience, success: true }, { status: 200, headers: { 'ETag': etag }, });
        }
    } catch (error) {
        console.log("Error occurred while fetching experience:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}
