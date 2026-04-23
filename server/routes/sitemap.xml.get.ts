/**
 * Minimalistische sitemap.xml — nur die öffentlichen Routen.
 * Protected Routes (/map, /spots, /add) hängen hinter Auth und haben
 * für Suchmaschinen keinen Nutzen.
 */
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const baseUrl = 'https://beer.shroomlife.de'
  const lastmod = new Date().toISOString().split('T')[0]

  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/auth`, priority: '0.6', changefreq: 'yearly' },
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return body
})
