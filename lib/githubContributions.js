const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

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

export async function fetchGitHubContributions() {
    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME;

    if (!token || !username) {
        throw new Error('GITHUB_TOKEN / USERNAME is not configured.');
    }

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
        next: { revalidate: 3600, tags: ['githubHeatmapData'] },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch from GitHub API: ${res.status} ${errorText}`);
    }

    const json = await res.json();
    if (json.errors) {
        throw new Error(`GitHub GraphQL query failed: ${JSON.stringify(json.errors)}`);
    }

    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
        throw new Error('GitHub contribution calendar not found.');
    }

    return {
        totalContributions: calendar.totalContributions,
        weeks: calendar.weeks,
        username,
    };
}