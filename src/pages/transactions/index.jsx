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
    console.log(user.role);
    if (user.role !== "Manager") {
        router.push("/login");
    } 
  }, [user, router]);

  const [originalInventory, setOriginalInventory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getInventory();
  }, []);


  useEffect(() => {
    getInventory();
  }, [inventory]);
  

  async function getInventory() {
    try {
      const response = await fetch('/api/order/getOrders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      
      // sort by orderDate descending
      data.sort((a, b) => {
        return new Date(b.orderDate) - new Date(a.orderDate);
      });

      // 2023-07-10T13:43:50+00:00 Clean this format

      data.forEach((order) => {
        order.orderDate = new Date(order.orderDate).toLocaleString();
      });
    
      setOriginalInventory(data);
      setInventory(data);
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
      { label: 'Order Id', key: 'orderId' },
      { label: 'Total Price', key: 'totalPrice' },
      { label: 'Order Date', key: 'orderDate' },
      { label: 'User Id', key: 'userId' },
    ],
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
