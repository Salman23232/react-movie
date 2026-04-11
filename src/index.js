import { ClerkProvider } from '@clerk/nextjs'
import './globals.scss' // Move your App.scss or main CSS here

export const metadata = {
  title: 'Next Movie App',
  description: 'Movie streaming app built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
