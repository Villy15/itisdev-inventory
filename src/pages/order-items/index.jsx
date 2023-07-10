import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    let user = req.session.user;
    if (!user) {
      user = {
        role: "Guest",
      }
    }

    return {
      props: {
        user,
      },
    };
  }
);

export default function Transactions({ user }) {
  const router = useRouter();
  
  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    }
  }, [user, router]);

  const [originalInventory, setOriginalInventory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryNames, setInventoryNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getInventory();
    getNames();
  }, []);


  useEffect(() => {
    getInventory();
  }, [inventory]);

  
  

  async function getInventory() {
    try {
      const response = await fetch('/api/order_item/getOrderItem', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
        // sort it by orderId desc    
        data.sort((a, b) => (a.orderId < b.orderId) ? 1 : -1)

      setOriginalInventory(data);
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getNames() {
    try {
      const response = await fetch('/api/inventory/getInventory', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setInventoryNames(data);
    } catch (err) {
      console.error(err);
    }
  }


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  

  const tableProps = {
    columns: [
      { label: "Order ID", key: "orderId" },
      {
        label: "Dish Name",
        key: "dishId",
        mapData: (row) => getDishName(row.dishId),
      },
      { label: "Quantity", key: "quantity" },
    ],
  };

  const getDishName = (dishId) => {
    const dish = inventoryNames.find((item) => item.dishId === dishId);
    return dish ? dish.ingredientName : "";
  };


  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      // If the search query is empty, revert back to the original inventory
      setInventory(originalInventory);
    }
  };

  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
          <Header page={"Orders"} user={user} />
          <div className="inventory">
          <div className="inventory-functions">
            <div>
              <input
                type="text"
                placeholder="Search Name"
                className="search"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div>{/* Your button links */}</div>
          </div>
          <Table
            data={currentItems}
            columns={tableProps.columns}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={inventory.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
        </div>
      </main>
    </>
  )
}

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    console.log(currentPage);
  }, [currentPage]);

  return (
    <ul className="pagination">
      {pageNumbers.map((number) => (
        <li key={number}>
          <a onClick={() => paginate(number)} className={`${number === currentPage ? 'active' : ''}`}>
            {number}
          </a>
        </li>
      ))}
    </ul>
  );
};
