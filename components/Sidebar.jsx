import Link from 'next/link'

import { MdOutlineInventory2 } from 'react-icons/md'
import { RxDashboard, RxArrowRight } from 'react-icons/rx'
import { useState, useEffect } from 'react';

const manager_sidebar_items = [
  {
    name: 'Dashboard',
    icon: <RxDashboard />,
    href: '/'
  },
  {
    name: 'View Inventory',
    icon: <RxDashboard />,
    href: '/inventory'
  },
  {
    name: 'Manager Users',
    icon: <RxDashboard />,
    href: '/users',
    functions: [
      {
        name: 'Add New User',
        icon: <RxArrowRight />,
        href: '/users/addUser'
      }
    ]
  },
  {
    name: 'View Reports',
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
    name: 'View Inventory',
    icon: <RxDashboard />,
    href: '/inventory',
    functions: [
      {
        name: 'Add New Inventory',
        icon: <RxArrowRight />,
        href: '/inventory/addinventory'
      },
      {
        name: 'Replenish Stock',
        icon: <RxArrowRight />,
        href: '/inventory/replenishstock',
      },
      {
        name: 'Input Expired',
        icon: <RxArrowRight />,
        href: '/inventory/expired',
      },
      {
        name: 'Input Physical Count',
        icon: <RxArrowRight />,
        href: '/inventory/physicalcount',
      },
    ]
  },
  {
    name: 'View Reports',
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
              <div className="link-container">
                <Link href={item.href} className="link">
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
                {item.functions && (
                  <ul className="functions-dropdown">
                    {item.functions.map((func, index) => (
                      <li key={index}>
                        <Link href={func.href} className="sub-link">
                          {func.icon}
                          <span>{func.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar