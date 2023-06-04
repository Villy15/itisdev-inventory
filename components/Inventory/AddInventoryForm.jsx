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
                        placeholder="Name"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        name="category"
                        id="category"
                        value={formValues.category}
                        placeholder="Category"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        value={formValues.quantity}
                        placeholder="Quantity"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="unit">Unit</label>
                    <input
                        type="text"
                        name="unit"
                        id="unit"
                        value={formValues.unit}
                        placeholder="Unit"
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddInventoryForm