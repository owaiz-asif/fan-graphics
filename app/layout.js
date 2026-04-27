import './globals.css'

export const metadata = {
  title: 'AFN GRAPHICS - A Unique Designing Solutions',
  description: 'You Dream it, We Design it! Professional graphic design and printing services.',
  icons: {
    icon: 'https://customer-assets.emergentagent.com/job_7060121b-ccd1-48d0-915c-ecd7813baa65/artifacts/l073y7a6_1000008394.jpg.jpeg'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-poppins">
        {children}
      </body>
    </html>
  )
}