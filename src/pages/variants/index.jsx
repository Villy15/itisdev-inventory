import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";

import Link from "next/link";
import { useState, useEffect } from "react";

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req, res }) {
  let user = req.session.user;

  if (!user) {
    user = {
      role: "Guest",
    };
  }

  return {
    props: {
      user,
    },
  };
});

const Inventory = ({ user }) => {
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [originalInventory, setOriginalInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getInventory();
  }, []);

  async function getInventory() {
    try {
      const response = await fetch('/api/variation/getAllVariants', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      // sort the inventory by ingredient name
      data.sort((a, b) => a.inventory.ingredientName.localeCompare(b.inventory.ingredientName));

      setOriginalInventory(data);
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const filteredInventory = originalInventory.filter((item) =>
      item.inventory.ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCurrentPage(1);
    setInventory(filteredInventory);
  }, [searchQuery, originalInventory]);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const tableProps = {
    columns: [
      { label: 'Ingredient Name', key: 'inventory.ingredientName' },
      { label: 'Variation name', key: 'variationName' },
      { label: 'Amount', key: 'amount' },
      { label: 'Unit Measurement', key: 'unit' },
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
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page="View Variants" user={user} />
        <div className="inventory">
          <div className="inventory-functions">
            <div>
              <input
                type="text"
                placeholder="Search Ingredient Name"
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
  );
};

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

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

export default Inventory;
