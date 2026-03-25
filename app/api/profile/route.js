import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import { readData, writeData } from '../../../utils/common';
import crypto from 'crypto'; // Ensure crypto is imported
import { revalidateTag } from 'next/cache';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        const profile = formData.get("profile");
        console.log('Profile:', profile);
        if (!profile) {
            return NextResponse.json({ message: "Please upload a profile picture.", success: false }, { status: 401 });
        }

        let profileUrl;

        if (profile && typeof profile === "object") {
            const fileBuffer = Buffer.from(await profile.arrayBuffer());
            const fileStream = Readable.from(fileBuffer);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    {
                        folder: 'projects_static_media', resource_type: 'image', format: "webp", quality: "auto:good", fetch_format: "auto", flags: "progressive",
                        eager: [
                            { format: 'webp', quality: 'auto:good' },
                            { format: 'jpg', quality: 'auto:good' }
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                fileStream.pipe(uploadStream);
            });
            profileUrl = result.secure_url;
        }

        const data = await readData();
        if (data.profile) {
            const publicId = data.profile.split('/').pop().split('.')[0];
            try {
                await cloudinary.v2.uploader.destroy(`projects_static_media/${publicId}`);
            } catch (cloudinaryError) {
                console.error("Cloudinary deletion error:", cloudinaryError.message);
                return NextResponse.json({ message: "Failed to delete associated media file.", success: false }, { status: 500 });
            }
        }
        data.profile = profileUrl;
        console.log(data.profile);
        await writeData(data);

        revalidateTag("profile");

        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        return NextResponse.json({ message: "Profile upload successful.", profile: profileUrl, success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while uploading profile:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const data = await readData();
        const profile = data.profile;

        if (!profile) {
            return NextResponse.json({ message: "Profile not found", success: false }, { status: 404 });
        }

        const publicId = profile.split('/').pop().split('.')[0];
        try {
            await cloudinary.v2.uploader.destroy(`projects_static_media/${publicId}`);
        } catch (cloudinaryError) {
            console.error("Cloudinary deletion error:", cloudinaryError.message);
            return NextResponse.json({ message: "Failed to delete associated media file.", success: false }, { status: 500 });
        }
        delete data.profile;
        await writeData(data);

        revalidateTag("profile");

        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        return NextResponse.json({ message: "Project deleted successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while deleting project:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}
