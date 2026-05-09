export const dynamic = 'force-static'

export default function Robots() {
  const body = `User-agent: *
Allow: /
Sitemap: https://afn-graphics.vercel.app/sitemap
Host: https://afn-graphics.vercel.app
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
