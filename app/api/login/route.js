import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'; 

const GlobalEmail = process.env.NEXT_EMAIL.split(",");
const GlobalPassword = process.env.NEXT_PASSWORD || "";
const JWT_SECRET = process.env.NEXT_JWT_SECRET || 'secret'; 

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (GlobalEmail.includes(email) && password === GlobalPassword) {
            const userId = email;
            const role = "admin";

            const token = jwt.sign({ id: userId, role }, JWT_SECRET,{expiresIn:'1h'});

            const headers = new Headers();
            headers.append('Set-Cookie', serialize('session_token', token, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 // 1 hour
            }));

            return new Response(JSON.stringify({ message: "Logged in.", success: true }), {
                status: 200,
                headers
            });
        }

        return new Response(JSON.stringify({ message: "Invalid Credentials.", success: false }), {
            status: 401
        });

    } catch (error) {
        console.log("Error occurred while logging in.", error.message);

        return new Response(JSON.stringify({ message: "Error occurred while logging in.", error: error.message, success: false }), {
            status: 500
        });
    }
};
