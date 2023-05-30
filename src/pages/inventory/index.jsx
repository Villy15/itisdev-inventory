"use client"

import Header from "../../../components/Header"
import Sidebar from "../../../components/Sidebar"

export default function Inventory() {
  return (
    <main>
      <Sidebar />
      <div className="main-section">
        <Header />
        <div className="inventory">
          <h1>Inventory</h1>
          <table>
            <thead>
              <tr>
                {/* {getTableHeaders()} */}
              </tr>
            </thead>
            <tbody>
              {/* {getTableData()} */}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  )
}