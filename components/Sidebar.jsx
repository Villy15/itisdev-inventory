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
    name: 'View Menu',
    icon: <RxDashboard />,
    href: '/menu'
  },
  {
    name: 'View Inventory',
    icon: <RxDashboard />,
    href: '/inventory', 
  },
  {
    name: 'Add Food/Drink',
    icon: <RxArrowRight />,
    href: '/menu/adddish'
  },
  {
    name: 'Record Purchase',
    href: '/inventory/replenishstock',
  }, 
  {
    name: 'Manager Users',
    icon: <RxDashboard />,
    href: '/users'
  },
  {
    name: 'Add New User',
    icon: <RxArrowRight />,
    href: '/users/addUser'
  },
  {
    name: 'View Reports',
    icon: <RxDashboard />,
    href: '/reports',
  },
  {
    name: 'View Increase Audit',
    icon: <RxArrowRight />,
    href: '/reports/increaseaudit'
  },
  {
    name: 'View Expired Audit',
    icon: <RxArrowRight />,
    href: '/reports/expiredaudit'
  },
  {
    name: 'View Missing Audit',
    icon: <RxArrowRight />,
    href: '/reports/missingaudit'
  },
  {
    name: 'View Orders',
    icon: <RxDashboard />,
    href: '/transactions'
  },
  {
    name: 'View Order Items',
    icon: <RxDashboard />,
    href: '/order-items'
  },
];

const stock_controller_sidebar_items = [
  {
    name: 'Dashboard',
    href: '/'
  },
  {
    name: 'View Inventory',
    href: '/inventory'
  },
  {
    name: 'Record Purchase',
    href: '/inventory/replenishstock',
  }, 
  {
    name: 'Input Expired',
    href: '/inventory/expired',
  }, 
  {
    name: 'Input Physical Count',
    href: '/inventory/physicalcount',
  },
  {
    name: 'View Variants',
    href: '/variants',
  },
  {
    name: 'Add New Variants',
    href: '/variants/addVariant',
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

const chef_sidebar_items = [
  {
    name: 'View Menu',
    icon: <RxDashboard />,
    href: '/menu'
  },
  {
    name: 'Add Food/Drink',
    icon: <RxArrowRight />,
    href: '/menu/adddish'
  },
  {
    name: 'Add New Inventory',
    href: '/inventory/addinventory'
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
                {/* {item.functions && (
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
                )} */}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar