import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema Cantina - CRUD',
  description: 'Sistema de gerenciamento para cantina escolar com operações CRUD',
  keywords: 'cantina, escola, crud, gerenciamento, produtos, estoque',
  authors: [{ name: 'Mateus Senai' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}