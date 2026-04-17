export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://purushotamjeswani.in';
    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date().toISOString(),
            changefreq: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/resume`,
            lastModified: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date().toISOString(),
            changefreq: 'monthly',
            priority: 0.5,
        },
    ]
}