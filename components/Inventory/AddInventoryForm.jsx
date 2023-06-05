import { useState } from 'react';
import { useRouter } from 'next/router';

const AddInventoryForm = () => {
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        name: '',
        category: '',
        quantity: '',
        unit: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.name || !formValues.category || !formValues.quantity || !formValues.unit) {
            alert('Please fill out all fields');
            return;
        }

        const newIngredient = { ...formValues };

        postIngredients(newIngredient);

        setFormValues({
            name: '',
            category: '',
            quantity: '',
            unit: '',
        });
    };

    async function postIngredients(newIngredient) {
        try {
            const response = await fetch('/api/inventory/postIngredients', {
                method: 'POST',
                body: JSON.stringify(newIngredient),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }

            const data = await response.json();
            console.log(data);
            router.push('/inventory');
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className='add-inventory-form'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        type="text"
                        name="category"
                        id="category"
                        value={formValues.category}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Category</option>
                        <option value="meat">Meat</option>
                        <option value="drinks">Drinks</option>
                        <option value="baking">Baking</option>
                        <option value="test">Dairy</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        value={formValues.quantity}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="unit">Unit</label>
                    <select
                        type="number"
                        name="unit"
                        id="unit"
                        value={formValues.unit}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Unit</option>
                        <option value="grams">Grams</option>
                        <option value="pieces">Pieces</option>
                        <option value="mililiters">Mililiters</option>
                        <option value="liters">Liters</option>
                    </select>
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddInventoryForm