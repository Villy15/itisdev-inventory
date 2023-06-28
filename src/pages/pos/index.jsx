import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

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

export default function POS({ user }) {
  const router = useRouter();

  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    } else {
      getDish();
    }
  }, [user, router]);

  const handleOnclick = (e) => {
    e.preventDefault();

    const dishName = e.target.querySelector(".dish-name").textContent;
    const dishPrice = e.target.querySelector(".dish-price").textContent;
    const dishQuantity = 1;

    
    // Add to orders
    const newOrder = {
      dishName,
      dishPrice,
      dishQuantity,
    };

    setOrders([...orders, newOrder]);
    console.log(orders);
  }

  async function getDish() {
    try {
      const response = await fetch('/api/dish/getDish', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setDishes(data);       
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
          <Header page={"POS"} user={user} />
          <div className="pos-system">
            <div className="pos-left">
              <div className="dishes">
                {/* Map dishes */}
                {dishes.map((dish) => (
                  <button key={dish.id} onClick={handleOnclick}>
                    <div className="dish-item">
                      <div className="dish-image"> 
                          {dish.dishName.toUpperCase()} 
                      </div>
                      <div className="dish-name">{dish.dishName}</div>
                      <div className="dish-price">P{dish.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="pos-right">
              <div className="orders">
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="name-quantity">
                      <div className="order-quantity">{order.dishQuantity}x</div>
                      <div className="order-name">{order.dishName}</div>
                    </div>
                    <div className="order-price">{order.dishPrice}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
