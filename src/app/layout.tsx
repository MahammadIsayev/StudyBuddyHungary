import './globals.css'


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <title>Study Buddy Hungary</title>
      <body className="h-full">

        {children}

      </body>
    </html>
  )
}