import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Image from "next/image";
import { withSessionSsr } from "@lib/withSession";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const getServerSideProps = withSessionSsr(async ({ req }) => {
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

async function fetchAPI(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }
  const data = await response.json();
  return data;
}

async function postAPI(url, body) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }
  const data = await response.json();
  return data;
}

export default function POS({ user }) {
  const router = useRouter();

  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dataOrders, setDataOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    } else {
      getDish();
    }
  }, [user, router]);

  const handleOnclick = (dishId) => {
    const selectedDish = dishes.find((dish) => dish.dishId === dishId);

    if (selectedDish) {
      const existingOrder = orders.find((order) => order.dishId === dishId);

      if (existingOrder) {
        const updatedOrders = orders.map((order) =>
          order.dishId === dishId ? { ...order, dishQuantity: order.dishQuantity + 1 } : order
        );

        setOrders(updatedOrders);
      } else {
        const dishName = selectedDish.dishName;
        const dishPrice = selectedDish.price;
        const dishQuantity = 1;

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
      const data = await fetchAPI("/api/dish/getDish");
      setDishes(data);
    } catch (err) {
      console.error(err);
    }
  }

  const totalPrice = orders.reduce((total, order) => total + order.dishPrice * order.dishQuantity, 0);


  const handleCheckout = async () => {
    const newOrder = {
      orderId: Math.max(...dataOrders.map((i) => i.orderId)) + 1,
      totalPrice,
      tableNumber: 1,
      orderDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }),
      userId: user.id,
    };
  
    await postOrder(newOrder);
  
    const orderItemId = Math.max(...orderItems.map((i) => i.order_itemId)) + 1;
  
    orders.forEach((order, index) => {
      console.log("index " + index);
      const newOrderItem = {
        order_itemId: orderItemId + index,
        orderId: newOrder.orderId,
        dishId: order.dishId,
        quantity: order.dishQuantity,
      };
      
      console.log(newOrderItem.order_itemId);
      postOrderItem(newOrderItem);
    });
  
    
    // Clear orders
    setOrders([]);
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    getOrders();
  }, [dataOrders]);

  async function getOrders() {
    try {
      const data = await fetchAPI("/api/order/getOrders");
      setDataOrders(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function postOrder(newOrder) {
    try {
      const data = await postAPI("/api/order/postOrder", newOrder);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getOrderItems();
  }, []);

  useEffect(() => {
    getOrderItems();
  }, [orderItems]);

  async function getOrderItems() {
    try {
      const data = await fetchAPI("/api/order_item/getOrderItem");
      setOrderItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function postOrderItem(newOrderItem) {
    try {
      const data = await postAPI("/api/order_item/postOrderItem", newOrderItem);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <main>
        <Sidebar role={user.role} />
        <div className="main-section">
          <Header page={"POS"} user={user} />
          <div className="pos-system">
            <div className="pos-left">
              <div className="dishes">
                {dishes.map((dish) => (
                  <button key={dish.dishId} onClick={() => handleOnclick(dish.dishId)}>
                    <div className="dish-item">
                      <div className="dish-image">
                        <Image alt="image" src={`/images/${dish.dishPhoto}.jpg`} width={200} height={200} />
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
                  <div key={order.dishId} className="order-item">
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
                <button className="checkout" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
