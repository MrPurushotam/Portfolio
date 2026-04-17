import { NextResponse } from 'next/server';

const workspaceName = process.env.COUNTER_WORKSPACE;
const projectName = process.env.COUNTER_NAME;
const apiKey = process.env.COUNTER_APIKEY;
const env = process.env.NODE_ENV || 'prod';

function validateEnv() {
    return workspaceName && projectName && apiKey;
}

export async function POST() {
    try {
        if (!validateEnv()) {
            return NextResponse.json(
                { error: "Server misconfiguration" },
                { status: 500 }
            );
        }

        if (env != 'prod' && env != 'production') {
            return NextResponse.json({ visitors: NaN });;
        };

        const res = await fetch(`https://api.counterapi.dev/v2/${workspaceName}/${projectName}/up`, {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Failed Response Object ", res);
            return NextResponse.json(
                { error: "Failed to fetch from counter service" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ visitors: data.data.up_count });
    } catch (error) {
        console.error("Visitor counter backend error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        if (!validateEnv()) {
            return NextResponse.json(
                { error: "Server misconfiguration" },
                { status: 500 }
            );
        }

        const res = await fetch(`https://api.counterapi.dev/v2/${workspaceName}/${projectName}/`, {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch from counter service" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ visitors: data.data.up_count });
    } catch (error) {
        console.error("Visitor counter backend error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
