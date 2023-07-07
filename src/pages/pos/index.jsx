import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Image from "next/image";

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

  // clog dishes
  useEffect(() => {
    console.log(dishes);
  }, [dishes]);
  

  const handleOnclick = (dishId) => {
    const selectedDish = dishes.find((dish) => dish.dishId === dishId);
  
    if (selectedDish) {
      const existingOrder = orders.find((order) => order.dishId === dishId);
  
      if (existingOrder) {
        // If the order already exists, update the quantity
        const updatedOrders = orders.map((order) => {
          if (order.dishId === dishId) {
            return {
              ...order,
              dishQuantity: order.dishQuantity + 1,
            };
          }
          return order;
        });
  
        setOrders(updatedOrders);
      } else {
        const dishName = selectedDish.dishName;
        const dishPrice = selectedDish.price;
        const dishQuantity = 1;
  
        // Add to orders
        const newOrder = {
          dishId,
          dishName,
          dishPrice,
          dishQuantity,
        };
  
        setOrders([...orders, newOrder]);
      }
    }
  };
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

  const totalPrice = orders.reduce((total, order) => total + order.dishPrice * order.dishQuantity, 0);

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
                  <button key={dish.dishId} onClick={() => handleOnclick(dish.dishId)}>
                    <div className="dish-item">
                      <div className="dish-image"> 
                        <Image alt="image" src={`/images/${dish.dishPhoto}.jpg`} width={200} height={200}></Image>
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
                <h1>Order Cart</h1>
                <div className="headers">
                  <div className="name">Name</div>
                  <div className="quantity">Quantity</div>
                  <div className="price">Price</div>
                </div>
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-name">{order.dishName}</div>
                    <div className="order-quantity">{order.dishQuantity}</div>
                    <div className="order-price">{order.dishPrice}</div>
                  </div>
                ))}
                <div className="footers">
                  <div className="total">Total</div>
                  <div className="total-price">P{totalPrice}</div>
                </div>
              </div>
              <div className="checkout">
                <button className="cancel">Cancel</button>
                <button className="proceed">Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
