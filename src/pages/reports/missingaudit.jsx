import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';

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
  const [missing, setMissing] = useState([]);

  // Pages
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getMissing();
  }, []);

  async function getMissing() {
    try {
      const data = await fetchAPI("/api/missing_inventory/getMissingFiltered");
      setMissing(data);
    } catch (err) {
      console.error(err);
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = missing.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"View Missing Reports"} user={user} />
        <div className="reports">
          <Table
            data={currentItems}
            columns={tableProps.columns}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={missing.length}
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