import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';
import { FaCheckCircle } from "react-icons/fa";

import { withSessionSsr } from "@lib/withSession";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const router = useRouter();


  useEffect(() => {
    console.log(user.role);
    if (user.role !== "Stock Controller" && user.role !== "Manager") {
      router.push("/login");
    }
  }, [user, router]);

  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;


  useEffect(() => {
    getOrders();
    getConfirmDish();
  }, []);


  async function getOrders() {
    try {
      const data = await fetchAPI("/api/order/getOrders");
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  async function getConfirmDish() {
    try {
      const data = await fetchAPI("/api/dish/getConfirmDish");
      setDishes(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    console.log(dishes);

  }, [dishes]);


  async function patchDish(dishId) {
    try {
      const data = await patchAPI(`/api/dish/patchDish`, { dishId });
      console.log(data);
      getConfirmDish();
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    // patchDish(23);
  }, []);


  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section ">
        <Header page="Dashboard" user={user} />
        <div className="main-dashboard">
          <div className="left-main">
            <div className="smaller-width">
              {/* <div className="dashboard-stock">
                <div className="row">
                  <div className="card">
                    Total Sales past 30 Days
                    <h1>
                      P15000.00
                    </h1>
                  </div>
                  <div className="card">
                    Total Dishes
                    <h1>
                      23
                    </h1>
                  </div>
                </div>
              </div> */}
              <div className="inventory">
                <h1>Recent Orders</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Order Date and Time</th>
                      <th>Total Price </th>
                      <th>Cashier</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((i, index) => (
                      <tr key={index}>
                        <td>
                          {i.orderDate.replace('T', ' ').slice(0, -6)}
                        </td>
                        <td className="row-right">
                          P{i.totalPrice.toFixed(2)}
                        </td>
                        <td className="row-left">
                          {i.users.lastname}
                        </td>
                        <td>
                          <Link href={`/transactions/details/${i.orderId}`} className="viewmore">
                            View More
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="right-main" style={{
            paddingTop: "2rem",
            paddingRight: "2rem",
          }}>
            <div className="sample-dishes">
              <h1>Dishes to Confirm</h1>
              <div className="dish-cards">
                {dishes.map((dish) => (
                  <DishCard
                    key={dish.dishId}
                    name={dish.dishName}
                    price={dish.price}
                    confirmed={dish.confirmed}
                    onConfirm={() => patchDish(dish.dishId)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const DishCard = ({ name, price, confirmed, onConfirm }) => {
  return (
    <div className={`dish-card ${confirmed ? "confirmed" : ""}`}>
      <h3>{name}</h3>
      <p>Price: P{price.toFixed(2)}</p>
      <button onClick={onConfirm}>Confirm</button>
    </div>
  );
};

export default Inventory;
