import './globals.css'

export const metadata = {
  metadataBase: new URL('https://afn-graphics.vercel.app'),
  title: 'AFN Graphics | Graphic Design, Branding, Custom Gifts, Posters',
  description: 'AFN Graphics provides professional graphic design, branding, custom gifts, posters and creative solutions for businesses and individuals.',
  keywords: [
    'AFN Graphics',
    'Graphic Design',
    'Branding',
    'Custom Gifts',
    'Posters',
    'Creative Solutions',
    'Print Design',
    'Brand Identity'
  ],
  authors: [
    { name: 'AFN Graphics', url: 'https://afn-graphics.vercel.app' }
  ],
  creator: 'AFN Graphics',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'AFN Graphics | Graphic Design, Branding, Custom Gifts, Posters',
    description: 'AFN Graphics provides professional graphic design, branding, custom gifts, posters and creative solutions for businesses and individuals.',
    type: 'website',
    url: 'https://afn-graphics.vercel.app',
    siteName: 'AFN Graphics',
    images: [
      {
        url: 'https://afn-graphics.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AFN Graphics preview image'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFN Graphics | Graphic Design, Branding, Custom Gifts, Posters',
    description: 'AFN Graphics provides professional graphic design, branding, custom gifts, posters and creative solutions for businesses and individuals.',
    images: ['https://afn-graphics.vercel.app/og-image.png'],
    creator: 'AFN Graphics'
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#e91e8c" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-poppins">
        {children}
      </body>
    </html>
  )
}