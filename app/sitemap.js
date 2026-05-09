const SITE_URL = 'https://afn-graphics.vercel.app'

export const dynamic = 'force-static'

export default function Sitemap() {
  const urlset = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

  return new Response(urlset, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
