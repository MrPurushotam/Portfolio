import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export const GET = async () => {
    try {
        const cookie = serialize('session_token', '', {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0),
        });

        return NextResponse.json({ message: "Logged out.", success: true }, {
            headers: {
                'Set-Cookie': cookie,
            },
        });
    } catch (error) {
        console.log("Some error occurred.", error.message);
        return NextResponse.json({ message: 'Internal Error', success: false }, { status: 500 });
    }
};
