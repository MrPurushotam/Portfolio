import { NextResponse } from 'next/server';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const LEVEL_MAP = {
    NONE: 'NONE',
    FIRST_QUARTILE: 'FIRST_QUARTILE',
    SECOND_QUARTILE: 'SECOND_QUARTILE',
    THIRD_QUARTILE: 'THIRD_QUARTILE',
    FOURTH_QUARTILE: 'FOURTH_QUARTILE',
};

const CONTRIBUTION_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME;

    if (!token || !username) {
        return NextResponse.json(
            { error: 'GITHUB_TOKEN / USERNAME is not configured.' },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(GITHUB_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: CONTRIBUTION_QUERY,
                variables: { username },
            }),
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('GitHub API error:', res.status, errorText);
            return NextResponse.json(
                { error: 'Failed to fetch from GitHub API' },
                { status: res.status }
            );
        }

        const json = await res.json();

        if (json.errors) {
            console.error('GitHub GraphQL errors:', json.errors);
            return NextResponse.json(
                { error: 'GitHub GraphQL query failed', details: json.errors },
                { status: 400 }
            );
        }

        const collection = json.data.user.contributionsCollection.contributionCalendar;

        return NextResponse.json({
            totalContributions: collection.totalContributions,
            weeks: collection.weeks,
            username,
        });
    } catch (error) {
        console.error('GitHub contributions fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
