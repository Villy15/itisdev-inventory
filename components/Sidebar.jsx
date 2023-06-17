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
    name: 'Users',
    icon: <RxDashboard />,
    href: '/users'
  },
  {
    name: 'Reports',
    icon: <RxDashboard />,
    href: '/reports'
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
    href: '/reports'
  },
];

const cashier_sidebar_items = [
  {
    name: 'POS Menu',
    icon: <RxDashboard />,
    href: '/pos'
  },  
  {
    name: 'Transactions',
    icon: <RxDashboard />,
    href: '/transactions'
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
      case "Cashier":
        setSidebarItems(cashier_sidebar_items);
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
          <h1>Restaurant</h1>
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