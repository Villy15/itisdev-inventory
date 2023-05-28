import '../../public/css/styles.scss'
import { Inter } from 'next/font/google'

import Sidebar from '../../components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ITISDEV',
  description: 'ITISDEV Inventory Management System for a Restaurant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Sidebar />
          {children}
        </main>
      </body>
    </html>
  )
}