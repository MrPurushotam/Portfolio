const ApiEndpoint = process.env.EXTENDED_APIENDPOINT;
const ApiKey = process.env.EXTENDED_APIKEY;

export async function readData() {
    try {
        const response = await fetch(`${ApiEndpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Api-key': ApiKey,
            },
            next: {
                revalidate: 24 * 3600,
                tags: ['projects', 'skills', 'profile', 'resume', 'githubHeatmapTheme']
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const textResponse = await response.text();
        let data = JSON.parse(textResponse);
        return {
            projects: data.projects || [],
            skills: data.skills || [],
            resumeDocId: data.resumeDocId || "",
            profile: data.profile || "",
            githubHeatmapTheme: data.githubHeatmapTheme || "ocean",
        };
    } catch (error) {
        console.error('Error reading data:', error.message);
    }
}

export async function writeData(updatedData) {
    try {
        await fetch(`${ApiEndpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Api-key': ApiKey
            },
            body: JSON.stringify(updatedData)
        });
    } catch (err) {
        console.log("Error writing data:", err.message);
    }
}


