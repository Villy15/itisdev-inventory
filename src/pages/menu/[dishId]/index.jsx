import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Image from "next/image";
import Table from "@components/Table";

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

export default function Dish({ user }) {
  const router = useRouter();
  const dishId = router.query.dishId;

  const [dishes, setDishes] = useState([]);
  const [dish, setDish] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState([]);

  const [inventory, setInventory] = useState([]);
  const [recipeWithIngredientName, setRecipeWithIngredientName] = useState([]);


  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    } else {
      getDish();
      getRecipe();
      getInventory();
    }
  }, [user, router]);

  useEffect(() => {
    if (dishes.length > 0) {
      const dish = dishes.find((dish) => dish.dishId == dishId);
      setDish(dish);
    }
  }, [dishes, dishId]);

  useEffect(() => {
    if (recipes.length > 0) {
      const filteredRecipe = recipes.filter((recipe) => recipe.dishId == dishId);
      
      setRecipe(filteredRecipe);
    }

  }, [recipes, dishId ]);
  

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


  async function getRecipe() {
      try {
          const response = await fetch('/api/recipe/getRecipes', {
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

  async function getInventory() {
      try {
          const response = await fetch('/api/inventory/getInventory', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          if (!response.ok) {
              throw new Error('Request failed with status ' + response.status);
          }

          const data = await response.json();
          setInventory(data);
      } catch (err) {
          console.error(err);
      }

  }
      
  const tableProps = {
    columns: [
      { label: 'Ingredient Name', key: 'ingredientName' },
      { label: 'Quantity', key: 'quantity' },
      { label: 'Unit Measure', key: 'unit' },
    ],
  };

  useEffect(() => {
    const updatedRecipeWithIngredientName = recipe.map((recipe) => {
      const ingredient = inventory.find((item) => item.inventoryId === recipe.ingredientId);
      const ingredientName = ingredient ? ingredient.ingredientName : '';
      return { ...recipe, ingredientName };
    });
  
    setRecipeWithIngredientName(updatedRecipeWithIngredientName);
  }, [recipe, inventory]);

  
  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
            <Header page={"Dish"} user={user} />
            <div className="dish-section">
              <div className="dish-info-row">
                <div className="dish-image">
                  <Image alt="image" src={`/images/${dish.dishPhoto}.jpg`} width={200} height={200}></Image>
                </div>
                <div className="dish-info">
                  <div className="price">
                    <div className="price-label">Price: P{dish.price}</div>
                  </div>
                  <div className="description">
                    <div className="description-label">Description: </div>
                    <div className="description-text">{dish.description}</div>
                  </div>
                </div>
              </div>
              <div className="recipe">
                <div className="recipe-label">List of Recipes: </div>
                <Table
                  data={recipeWithIngredientName}
                  columns={tableProps.columns}
                  currentPage={1}
                  itemsPerPage={10}
                  // data={currentItems}
                  // columns={tableProps.columns}
                  // currentPage={currentPage}
                  // itemsPerPage={itemsPerPage}
                />
            </div>
            </div>
        </div>
      </main>
    </>
  )
}
