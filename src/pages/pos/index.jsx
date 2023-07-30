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

async function patchAPI(url, body) {
  const response = await fetch(url, {
    method: "PATCH",
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
  const [appliedFilter, setAppliedFilter] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [conversion, setConversion] = useState([]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    console.log(user.role);
    if (user.role !== "Cashier" && user.role !== "Manager") {
        router.push("/login");
    } else {
      getDish();
    }
  }, [user, router]);

  useEffect(() => {
    getOrders();
    getOrderItems();
    getRecipes();
    getInventory();
    getConversions();
  }, []);

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
    setConfirmationData({
      title: "Checkout",
      message: "Are you sure you want to checkout?",
    });

    // Show the confirmation popup
    setShowConfirmation(true)
  };

   const handleConfirmationSubmit = async () => {
    
    const newOrder = {
      orderId: Math.max(...dataOrders.map((i) => i.orderId)) + 1,
      totalPrice,
      orderDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }),
      userId: user.id,
    };

    await postOrder(newOrder);
    console.log(newOrder);

    const orderItemId = Math.max(...orderItems.map((i) => i.order_itemId)) + 1;

    orders.forEach((order, index) => {
      const newOrderItem = {
        order_itemId: orderItemId + index,
        orderId: newOrder.orderId,
        dishId: order.dishId,
        quantity: order.dishQuantity,
      };

      postOrderItem(newOrderItem);
      console.log(newOrderItem);

      let recipe = [];

      // get all recipes of the dish
      recipes.forEach((recipeItem) => {
        if (recipeItem.dishId === order.dishId) {
          recipe.push(recipeItem);
        }
      });

      // update inventory
      recipe.forEach((recipeItem) => {
        let newInventory = {};

        inventory.forEach((inventoryItem) => {
          if (inventoryItem.inventoryId === recipeItem.ingredientId) {
            let convertedRecipeQuantity = recipeItem.quantity;

            conversion.forEach((conversion) => {
              if (conversion.from_unit == recipeItem.unit && conversion.to_unit == inventoryItem.unit) {
                convertedRecipeQuantity *= conversion.to_quantity;
                // End loop
                return;
              }
            });

            console.log("Recipe Quantity: " + recipeItem.quantity);
            console.log("Recipe Unit: " + recipeItem.unit);
            console.log("Inventory Quantity: " + inventoryItem.quantity);
            console.log("Inventory Unit: " + inventoryItem.unit);
            
                        
            console.log("Converted Recipe Quantity: " + convertedRecipeQuantity);
            newInventory = {
              inventoryId: recipeItem.ingredientId,
              quantity: inventoryItem.quantity - convertedRecipeQuantity * order.dishQuantity,
            };

            patchInventory(newInventory);
            console.log(newInventory);
          }
        });
      });


      console.log(recipe);
    });


    // Clear orders
    setOrders([]);
    
    // Hide the confirmation popup
    setShowConfirmation(false);
};

const handleCancelOrder = () => {
  // Clear the form values
  setOrders([]);

  // Hide the confirmation popup
  setShowConfirmation(false);
};


  const removeItem = (dishId) => {
    const updatedOrders = orders.filter((order) => order.dishId !== dishId);
    setOrders(updatedOrders);
  };

  const handleDeductQuantity = (dishId) => {
    const existingOrder = orders.find((order) => order.dishId === dishId);

    if (existingOrder) {
      const updatedOrders = orders.map((order) =>
        order.dishId === dishId
          ? { ...order, dishQuantity: Math.max(0, order.dishQuantity - 1) } // Ensure dishQuantity is at least 0
          : order
      );

      const filteredOrders = updatedOrders.filter((order) => order.dishQuantity > 0);

      setOrders(filteredOrders);
    }
  };

  const handleAddQuantity = (dishId) => {
    const updatedOrders = orders.map((order) =>
      order.dishId === dishId ? { ...order, dishQuantity: order.dishQuantity + 1 } : order
    );
    setOrders(updatedOrders);
  };

  useEffect(() => {
    getOrders();
  }, [dataOrders]);

  useEffect(() => {
    getInventory();
  }, [inventory]);

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

  async function getRecipes() {
    try {
      const data = await fetchAPI("/api/recipe/getRecipes");
      setRecipes(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getInventory() {
    try {
      const data = await fetchAPI("/api/inventory/getInventoryWithId");
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function patchInventory(newInventory) {
    try {
      const data = await patchAPI("/api/inventory/patchInventory", newInventory);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }
  
  async function getConversions () {
    try {
      const data = await fetchAPI("/api/conversion_table/getConversions");
      setConversion(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <main>
        {/* <Sidebar role={user.role} /> */}
        <div className="main-section">
          <Header page={"POS"} user={user} />
          <div className="pos-system">
            <div className="pos-left">
              {/* Add Filter button based on categories */}
              <div className="filters">
                <button className="filter" onClick={() => setAppliedFilter("")}>
                  All
                </button>
                {/* {dishes
                  .map((dish) => dish.category)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((category) => (
                    <button key={category} className="filter" onClick={() => setAppliedFilter(category)}>
                      {category}
                    </button>
                  ))} */}
                <button className="filter" onClick={() => setAppliedFilter("Appetizer")}>
                  Appetizer
                </button>
                <button className="filter" onClick={() => setAppliedFilter("Mains")}>
                  Mains
                </button>
                <button className="filter" onClick={() => setAppliedFilter("Desserts")}>
                  Desserts
                </button>
                <button className="filter" onClick={() => setAppliedFilter("Beverages")}>
                  Beverages
                </button>
              </div>
              <div className="dishes">
                {dishes
                  .filter((dish) => dish.category.includes(appliedFilter))
                  .map((dish) => (
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
                  <div key={order.dishId} className="order-item" id = 'orderItem'> 
                    <div className="order-name">{order.dishName}</div>
                    <div className="order-quantity"> 
                      <button className="add-quantity" onClick={() => handleAddQuantity(order.dishId)}> + </button> 
                        <div className="quantity-text">{order.dishQuantity}</div>
                        <button className="deduct-quantity" onClick={() => handleDeductQuantity(order.dishId)}> - </button>
                    </div>
                    <div className="order-price">{order.dishPrice}</div>
                    <button className="cancel" onClick={() => removeItem(order.dishId)}> Remove </button>
                  </div>
                ))}
                <div className="footers">
                  <div className="total">Total</div>
                  <div className="total-price">P{totalPrice}</div>
                </div>
              </div>
              <div className="checkout">
                <button className="checkout" onClick={handleCheckout}> 
                  Checkout
                </button>
              </div>
              {showConfirmation && (
                    <div className='confirmation-popup'>
                        <p>{confirmationData?.title}</p>
                        <p>{confirmationData?.message}</p>
                        <button onClick={handleConfirmationSubmit}>Confirm Checkout</button>
                        <button onClick={handleCancelOrder}>Cancel Checkout</button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
