import './globals.css'

export const metadata = {
  title: 'Graun!',
  description: 'A digital media company simulation game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
