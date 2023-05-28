import '../../public/css/styles.scss'
import { Inter } from 'next/font/google'

import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'

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
          <div>
            <Header />
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}