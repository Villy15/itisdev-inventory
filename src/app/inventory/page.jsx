"use client"

import { useEffect, useState } from "react"
import getIngredients from "../api/inventory/getIngredients";


export default function Inventory() {
    const [ingredients, setIngredients] = useState([])

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

    return (
        <div>
            <h1>Inventory</h1>
            <ul>    
                {ingredients.map((ingredient) => (
                    <li key={ingredient.id}>{ingredient.name}</li>
                ))}
            </ul>
        </div>
    )
}