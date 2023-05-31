import Link from 'next/link'

import { IconContext } from "react-icons";
import { MdOutlineInventory2 } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'

const sidebar_items = [
  {
    name: 'Dashboard',
    icon: <RxDashboard />,
    href: '/'
  },  
  {
    name: 'Inventory',
    icon: <RxDashboard />,
    href: '/inventory'
  },
  {
    name: 'Reports',
    icon: <RxDashboard />,
    href: '/'
  },  
  {
    name: 'Employees',
    icon: <RxDashboard />,
    href: '/'
  },  
  {
    name: 'POS Menu',
    icon: <RxDashboard />,
    href: '/'
  },  
  {
    name: 'Login',
    icon: <RxDashboard />,
    href: '/login'
  },
];


const Sidebar = () => {
  return (
    <div>
      <aside className='sidebar'>
        <div className='top'>
          <MdOutlineInventory2  className='icon'/> 
          <h1>Restaurant</h1>
        </div>
        <ul>
          {sidebar_items.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className='link'>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar