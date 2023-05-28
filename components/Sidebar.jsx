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
  }  
];


const Sidebar = () => {
  return (
    <div>
      <aside className='sidebar'>
        <div className='top'>
          <MdOutlineInventory2  className='icon'/> 
          <h1>Inventory</h1>
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

    // <div className='sidebar'>
    //     <div className='header'>
    //         <MdOutlineInventory2 />
    //         <h1>Inventory</h1>
    //     </div>
    //     <ul>
    //         <li>Inventory</li>
    //         <li>Add New Food</li>
    //         <li>Add New Ingredient</li>
    //         <li>Reports</li>
    //         <li>Employees</li>
    //         <li>POS Menu</li>
    //     </ul>
    // </div>
  )
}

export default Sidebar