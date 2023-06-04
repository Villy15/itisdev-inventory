import Link from 'next/link'

import { MdOutlineInventory2 } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'
import { useState, useEffect } from 'react';

const manager_sidebar_items = [
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
];

const stock_controller_sidebar_items = [
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
];

const chef_sidebar_items = [
  {
    name: 'POS Menu',
    icon: <RxDashboard />,
    href: '/'
  },  
];


const Sidebar = ({role}) => {
  const [sidebarItems, setSidebarItems] = useState([]);
    
  useEffect(() => {
    switch (role) {
      case "Manager":
        setSidebarItems(manager_sidebar_items);
        break;
      case "Stock Controller":
        setSidebarItems(stock_controller_sidebar_items);
        break;
      case "Chef":
        setSidebarItems(chef_sidebar_items);
        break;
      default:
        setSidebarItems([
          {
            name: "Login",
            icon: <RxDashboard />,
            href: "/login",
          },
        ]);
        break;
    }
  }, [role]);

  return (
    <div>
      <aside className='sidebar'>
        <div className='top'>
          <MdOutlineInventory2  className='icon'/> 
          <h1>{role}</h1>
        </div>
        <ul>
          {sidebarItems.map((item, index) => (
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