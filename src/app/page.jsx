"use client"

import { useEffect, useState } from "react"
import { getIngredients } from "./api/inventory/getIngredients";

export default function Home() {
  const [ingredients, setIngredients] = useState([])
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    let user = {
      username: username,
      password: password
    };

    console.log(user);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIngredients();
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
    <div className="inventory">
      <h1>Inventory</h1>
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
      <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
    </div>
  )
}