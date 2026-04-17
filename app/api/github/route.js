import { NextResponse } from 'next/server';
import { fetchGitHubContributions } from '@/lib/githubContributions';

export async function GET() {
    try {
        const data = await fetchGitHubContributions();
        return NextResponse.json(data);
    } catch (error) {
        console.error('GitHub contributions fetch error:', error);

        if (error?.message?.includes('not configured')) {
            return NextResponse.json(
                { error: 'GITHUB_TOKEN / USERNAME is not configured.' },
                { status: 400 }
            );
        }

        if (error?.message?.includes('Failed to fetch from GitHub API')) {
            return NextResponse.json(
                { error: 'Failed to fetch from GitHub API' },
                { status: 502 }
            );
        }

        if (error?.message?.includes('GitHub GraphQL query failed')) {
            return NextResponse.json(
                { error: 'GitHub GraphQL query failed' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
