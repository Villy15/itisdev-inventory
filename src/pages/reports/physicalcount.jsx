import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';

import { withSessionSsr } from "@lib/withSession";
import { useState, useEffect } from "react";
import Link from "next/link";

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
    const [physicalCount, setPhysicalCount] = useState([]);

  // Pages
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getPhysicalCount();
  }, []);

  async function getPhysicalCount() {
    try {
        const data = await fetchAPI("/api/physical_count/getPhysicalCountNames");
        setPhysicalCount(data);
    } catch (err) {
        console.error(err);
    }
}

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = physicalCount.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const tableProps = {
    columns: [
      { label: 'Sheet no.', key: 'sheet_number' },
      { label: 'Date Submitted', key: 'updateDate' },
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

  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"View Physical Count"} user={user} />
        <div className="reports">
          <input
            type="text"
            placeholder="Search Employee Name"
            className="search"
            value={searchQuery}
            onChange={handleSearch}
          />
            <table>
                <thead>
                    <tr>
                        <th>Sheet no.</th>
                        <th>Date Submitted</th>
                        <th>Submitted by</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((i, index) => (
                        <tr key={index}>
                            <td>
                                {i.sheet_number}
                            </td>
                            <td>
                                {/* format date of  2023-07-28T14:06:58+00:00 to YYYY-MM-DD*/}
                                {i.updateDate.split('T')[0]}
                            </td>
                            <td>
                                {i.users.lastname}
                            </td>
                            <td>
                                <Link href={`/reports/physicalcount/${i.sheet_number}`} className="viewmore">
                                    View More
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={physicalCount.length}
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