import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Image from "next/image";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchAPI, patchAPI, deleteAPI, postAPI } from "@api/*";

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

export default function Dish({ user }) {
  const router = useRouter();
  const dishId = router.query.dishId;

  const [dish, setDish] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function getDish() {
      try {
        const response = await fetch(`/api/dish/getDishDetails?dishId=${dishId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Request failed with status ' + response.status);
        }
  
        const data = await response.json();
        setDish(data);       
      } catch (err) {
        console.error(err);
      }
    }
  

    async function getRecipe() {
        try {
            const response = await fetch(`/api/recipe/getDishRecipe?dishId=${dishId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
  
            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }
  
            const data = await response.json();
            setRecipes(data);
        } catch (err) {
            console.error(err);
        }
    }

    if (user.role === "Guest") {
      router.push("/login");
    } else {
      getDish();
      getRecipe();
    }
  }, [user, router, dishId]);

  useEffect(() => {
    console.log(recipes);
  }, [recipes]);
  
      
  const tableProps = {
    columns: [
      { label: 'Ingredient Name', key: 'inventory.ingredientName' },
      { label: 'Quantity', key: 'quantity' },
      { label: 'Unit Measure', key: 'unit' },
    ],
  };

  async function enableDish(dish) {
    try {
      const data = await patchAPI("/api/dish/patchDishEnable", dish);
      console.log(data);
      // router.push('/users');

      
    } catch (err) {
      console.error(err);
    }
  }

  const toggleDishEnable = async (dish) => {
    try {
      // Invert the 'enable' value and create a new object with the updated value and the 'id'
      const updatedDish = {
        dishId: dishId,
        enable: !dish[0].enable,
      };

      // Call the 'enableDish' function with the updated object
      await enableDish(updatedDish);
      console.log(updatedDish);
      console.log("HGIII");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
            <Header page={"Dish"} user={user} />
            <div className="dish-section">
              {dish.length > 0 && (
              <div className="dish-info-row">
                <div className="dish-image">
                  <Image alt="image" src={`/images/${dish[0].dishPhoto}.jpg`} width={200} height={200}></Image>
                </div>
                <div className="dish-info">
                  <div className="price">
                    <div className="price-label">Price: P{dish[0].price}</div>
                  </div>
                  <div className="description">
                    <div className="description-label">Description: </div>
                    <div className="description-text">{dish[0].description}</div>
                  </div>
                  {/* If dish is enabled, display disabled button, if its disabled, display enable */}
                  {/* Only display if user.role == "Manager" */}
                  {user.role === "Manager" && (
                    <button onClick={() => toggleDishEnable(dish)} style={{
                      width: "100px",
                    }}>
                      {dish[0].enable ? "Disable" : "Enable"}
                    </button>
                  )}
                </div>
              </div>
              )}
              <div className="recipe">
                <div className="recipe-label">List of Recipes: </div>
                <Table
                  data={recipes}
                  columns={tableProps.columns}
                  currentPage={1}
                  itemsPerPage={10}
                />
            </div>
            </div>
        </div>
      </main>
    </>
  )
}
