import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';

import { withSessionSsr } from "@lib/withSession";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import getUser from "@/api/users/getUser";

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

  const router = useRouter();
  const sheet_number = router.query.sheet_number;

  const [physicalCountList, setPhysicalCountList] = useState([]);
  const [users, setUsers] = useState({});
  

  // Pages
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = physicalCountList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => { 
    async function getPhysicalCountList() {
      try {
        const data = await fetchAPI(`/api/physical_count_list/getPhysicalCountListId?sheet_number=${sheet_number}`);
        setPhysicalCountList(data);
      } catch (err) {
        console.error(err);
      }
    }

    getPhysicalCountList();
    getUsers();
  }, [sheet_number]);

  async function getUsers() {
    try {
      const data = await fetchAPI("/api/users/getUser?userId=2");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    console.log(users);
  }, [users]);
  
  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"Detaled Physical Report"} user={user} />
        <div className="reports">
        <div className="details">
            <div className="row">
              <div className="report-header">Sheet No: <span>{physicalCountList.length > 0 ? physicalCountList[0].sheet_number : ''}</span></div>
              <div className="report-header">Date: <span>{physicalCountList.length > 0 ? physicalCountList[0].physical_count.updateDate : ''}</span></div>
            </div>
            <div className="row">
              <div className="report-header">Prepared By: <span>{users.length > 0 ? users[0].lastname : ''}, {users.length > 0 ? users[0].firstname : ''}</span></div>
            </div>
        </div>
          <table>
            <thead>
              <tr>
                <th>Ingredient Name</th>
                <th>Unit</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((i, index) => (
                <tr key={index}>
                  <td>
                    {i.inventory.ingredientName}
                  </td>
                  <td>
                    {i.unit}
                  </td>
                  <td>
                    {i.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={physicalCountList.length}
            currentPage={currentPage}
            paginate={paginate}
          />
          <h1>END OF REPORT</h1>

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