import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"

import { useState, useEffect } from "react";
import { getIngredients } from "./api/inventory/getIngredients";

export default function Home() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    // fetchIngredients();
  }, []);

  async function fetchIngredients() {
    try {
      const fetchedIngredients = await getIngredients();
      setIngredients(fetchedIngredients);
    } catch (error) {
      console.error(error);
    }
  }

  function getTableHeaders() {
    if (ingredients.length === 0) {
      return null;
    }

    const ingredientKeys = Object.keys(ingredients[0]);
    return ingredientKeys.map((key) => (
      <th key={key}>{key}</th>
    ));
  }

  function getTableData() {
    return ingredients.map((ingredient) => (
      <tr key={ingredient.id}>
        {Object.values(ingredient).map((value, index) => (
          <td key={index}>{value}</td>
        ))}
      </tr>
    ));
  }

  return (
    <>
      <main>
        <Sidebar />
        <div className="main-section">
          <Header />
          <div className="inventory">
            <h1>Dashboard</h1>
            <table>
              <thead>
                <tr>
                  {getTableHeaders()}
                </tr>
              </thead>
              <tbody>
                {getTableData()}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </>
  )
}
