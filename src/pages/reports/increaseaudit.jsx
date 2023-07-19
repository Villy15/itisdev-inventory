import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";
import { useState, useEffect } from "react";

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

const Reports = ({
  user
}) => {
  const [originalIncreased, setOriginalIncreased] = useState([]); // [
  const [increased, setIncreased] = useState([]);

  // Pages
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchIncreased();
  }, []);

  async function fetchIncreased() {
    try {
      const response = await fetch('/api/reports/getIncreased', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setIncreased(data);
    } catch (err) {
      console.error(err);
    }
  }

  // useEffect(() => {
  //   const filteredInventory = originalIncreased.filter((item) =>
  //     item.ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setCurrentPage(1);
  //   setIncreased(filteredInventory);

  // }, [searchQuery, originalIncreased]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = increased.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const tableProps = {
    columns: [
      { label: 'Item name', key: 'inventory.ingredientName' },
      { label: 'Quantity', key: 'quantity' },
      { label: 'Unit of Measurement', key: 'unit' },
      { label: 'Date Submitted', key: 'newDate' },
      { label: 'Submitted by', key: 'users.lastname' },
    ],
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      // If the search query is empty, revert back to the original inventory
      // setIncreased(originalIncreased);
    }
  };

  // const handleSearch = (event) => {
  //   const query = event.target.value;
  //   setSearchQuery(query);

  //   if (query.trim() === '') {
  //     // If the search query is empty, revert back to the original inventory
  //     setInventory(originalInventory);
  //   }
  // };


  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"Reports"} user={user} />
        <div className="reports">
          <h1>Increase Audit</h1>
          <input
            type="text"
            placeholder="Search ItemName"
            className="search"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Table
            data={increased}
            columns={tableProps.columns}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={increased.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      </div>
    </main>
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


export default Reports;