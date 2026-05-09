export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://afn-graphics.vercel.app/sitemap.xml',
  }
}
