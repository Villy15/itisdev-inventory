import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AddInventoryForm = () => {
    const router = useRouter();
    const [inventory, setInventory] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        quantity: '',
        description: '',
    });

    useEffect(() => {
        getInventory();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.name || !formValues.quantity || !formValues.unit) {
            alert('Please fill out all fields');
            return;
        }

        const newInventory = { 
            inventoryId: Math.max.apply(Math, inventory.map(function(i) { return i.inventoryId; })) + 1,
            ingredientName: formValues.name,
            quantity: parseFloat(formValues.quantity),
            unit: formValues.unit,
            updateDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
            enable: true,
            enableDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
            // description: formValues.description,
         };

        postInventory(newInventory);

        setFormValues({
            name: '',
            quantity: '',
            unit: '',
        });
    };

    async function postInventory(newInventory) {
        try {
            const response = await fetch('/api/inventory/postInventory', {
                method: 'POST',
                body: JSON.stringify(newInventory),
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

    return (
        <div className='add-inventory-form'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name <span>* </span></label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity <span>* </span></label>
                    <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        value={formValues.quantity}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="unit">Unit <span>* </span></label>
                    <select
                        type="number"
                        name="unit"
                        id="unit"
                        value={formValues.unit}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Unit</option>
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                        <option value="liters">liters</option>
                    </select>
                </div>
                <button type="button" 
                    onClick={
                        () => router.push('/inventory')
                    }> Cancel</button>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddInventoryForm