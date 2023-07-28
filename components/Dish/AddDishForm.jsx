import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FileUploader } from 'react-drag-drop-files';

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
  
const fileTypes = ['JPEG', 'JPG', 'PNG'];

const AddDishForm = () => {
    const router = useRouter();


    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
    });
    const [ingredients, setIngredients] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
      };
    
      const handleAddIngredient = () => {
        setIngredients([...ingredients, { ingredient: '', quantity: '', unit: '' }]);
      };
    
      const handleRemoveIngredient = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
      };

    const [file, setFile] = useState(null);

    const handleChange = (file) => {
        // Assuming you want to handle only one file for the image, so we'll take the first one from the array.
        // If you want to handle multiple images, modify accordingly.
        setFile(file[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if all required fields are filled
        if (!formValues.name || !formValues.price || !formValues.category) {
          alert('Please fill out all required fields');
          return;
        }
        
    
        // Construct the new dish object
        const newDish = {
          name: formValues.name,
          price: parseFloat(formValues.price),
          category: formValues.category,
          description: formValues.description,
          ingredients,
        };

          // Append the image file to the newDish object (if present)
        if (file) {
            newDish.image = file.preview;
        }
    
        // Perform the necessary actions with the new dish data (e.g., save to API)
        postDish(newDish);
    
        // Reset form values and ingredients
        setFormValues({
          name: '',
          price: '',
          category: '',
          description: '',
          image: '',
        });
        setIngredients([]);
        setFile(null); // Reset the selected file after form submission
      };

    return (
        <div className='add-inventory-form'>
            <form onSubmit={handleSubmit}>
                <div className="sub-group">
                    <div className="form-group">
                        <label htmlFor="name">Input Food/Drink Name: <span>* </span></label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formValues.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Input Price: <span>* </span></label>
                        <input
                            type="number" // Number
                            name="price"
                            id="price"
                            value={formValues.price}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category <span>* </span></label>
                    <select
                        type="text"
                        name="category"
                        id="category"
                        value={formValues.category}
                        onChange={handleInputChange}
                    >

                        <option value="" hidden>Select Category</option>
                        <option value="Manager">Appetizers</option>
                        <option value="Stock Controller">Mains</option>
                        <option value="Cashier">Beverages</option>                       
                        <option value="Cashier">Desserts</option>                       
                    </select>
                </div>
                <div className="sub-group">
                    <div className="form-group">
                            <label htmlFor="description">Input Food/Drink Description: </label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                className='description'
                                value={formValues.description}
                                onChange={handleInputChange}
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Insert Image: </label>
                            <FileUploader
                                multiple={true}
                                handleChange={handleChange}
                                name="image"
                                types={fileTypes}
                                uploadText="Drop or click to select an image"
                            />
                        <p>{file ? `File name: ${file.name}` : 'no image selected'}</p>
                    </div>  
                </div>
                {/* Add Table where you can input ingredients, quantity, and unit */}
                <div className="ingredients-table">
                    <h2>Input List of Ingredients</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Ingredient</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>
                                    <button type="button" onClick={handleAddIngredient}>
                                        Add Ingredient
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((ingredient, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={ingredient.ingredient}
                                            onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={ingredient.quantity}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={ingredient.unit}
                                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => handleRemoveIngredient(index)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button type="button" 
                    onClick={
                        () => router.push('/inventory')
                    }> Cancel</button>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default AddDishForm