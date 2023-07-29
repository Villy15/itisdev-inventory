import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';


const AddInventoryForm = () => {
    const router = useRouter();
    const [inventory, setInventory] = useState([]);
    const [units, setUnits] = useState([]); 
    const [conversions, setConversions] = useState([]);
     
    const [formValues, setFormValues] = useState({
        name: '',
        unit: '',
    });

    useEffect(() => {
        getInventory();
        getUnits();
        getConversions();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // if (!formValues.name ||  !formValues.unit) {
        //     alert('Please fill out all fields');
        //     return;
        // }

        const newInventory = { 
            inventoryId: Math.max.apply(Math, inventory.map(function(i) { return i.inventoryId; })) + 1,
            ingredientName: formValues.name,
            unit: formValues.unit,
            updateDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
            enable: true,
            enableDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
         };

         console.log(newInventory);

        postInventory(newInventory);

        setFormValues({
            name: '',
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
        } catch (error) {
            console.error(error);
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

    async function getUnits() {
        try {
            const data = await fetchAPI("/api/units_table/getUnits");
            setUnits(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function getConversions() {
        try {
            const data = await fetchAPI("/api/conversion_table/getConversions");
            setConversions(data);
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
                    <label htmlFor="quantity">Unit Measurement <span>* </span>
                    </label>
                    <select
                        type="text"
                        name="unit"
                        id="unit"
                        value={formValues.unit}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Unit</option>
                        {units.map((i) => (
                            <option key={i.unitshort} value={i.unitshort}>
                                {i.unitshort}
                            </option>
                        ))}
                    </select>
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

export default AddInventoryForm