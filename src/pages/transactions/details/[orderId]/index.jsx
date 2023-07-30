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
  const orderId = router.query.orderId;

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
        const data = await fetchAPI(`/api/order_item/getOrderItemId?orderId=${orderId}`);
        setPhysicalCountList(data);
      } catch (err) {
        console.error(err);
      }
    }

    getPhysicalCountList();

    async function getUsers() {
        try {
          const data = await fetchAPI(`/api/order/getOrderId?orderId=${orderId}`);
          setUsers(data);
        } catch (err) {
          console.error(err);
        }
      }

    getUsers();
  }, [orderId]);

  

  useEffect(() => {
    console.log(users);
  }, [users]);
  
  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"Order Details"} user={user} />
        <div className="reports">
                  <div className="details">
                      <div className="row">
                          <div className="report-header">Date: <span>{users.length > 0 ? users[0].orderDate : ''}</span></div>
                          <div className="report-header">Cashier: <span>{users.length > 0 ? users[0].users.lastname : ''}</span></div>
                      </div>
                      <div className="row">
                        <div className="report-header">Total Price: <span>P{users.length > 0 ? users[0].totalPrice : ''}</span></div>
                      </div>
                  </div>
                  <table>
                      <thead>
              <tr>
                <th>Dish Name</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((i, index) => (
                <tr key={index}>
                  <td className="row-left">
                    {i.dish.dishName}
                  </td>
                  <td className="row-right">
                    P{i.dish.price.toFixed(2)}
                  </td>
                  <td className="row-right">
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