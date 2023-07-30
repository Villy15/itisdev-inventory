import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';

const ReplenishStockForm = ({user}) => {
    const router = useRouter();
    const { inventoryId } = router.query;

    const [inventory, setInventory] = useState([]);
    const [variant, setVariant] = useState([]); 
    const [units, setUnits] = useState([]); 
    const [conversions, setConversions] = useState([]);  

    const [formValues, setFormValues] = useState({
        name: '',
        variant: '',
        quantity: '',
        units: '',
    });

    const[selectedInventoryId, setSelectedInventoryId] = useState(null);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);

    useEffect(() => {
        getInventory();
        getUnits();
        getConversions();
    }, []);

    useEffect(() => {
        getInventory();
    }, [inventory]);

    useEffect(() => {
        if (inventoryId) {
            const selectedIngredient = inventory.find(
                (i) => i.inventoryId === parseInt(inventoryId)
            );

            if (selectedIngredient) {
                setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    name: selectedIngredient.ingredientName,
                }));
            }
        }
    }, [inventoryId, inventory]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const inventoryId = inventory.find((i) => i.ingredientName === value)?.inventoryId;
        setSelectedInventoryId(inventoryId); // Update selected inventoryId
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.name || !formValues.quantity  /* || !formValues.units */) {
            alert('Please fill in all required fields!');
            return;
        }

        // Calculate current and after quantities
        const selectedInventory = inventory.find((i) => i.ingredientName == formValues.name);
        let convertedQuantity = 0;

        if (formValues.variant) {
            const selectedVariant = variant.find((i) => i.variationName == formValues.variant);
            // Get the conversion rate of the selectedVariant
            convertedQuantity = convertUnits(selectedVariant.unit, selectedInventory.unit, selectedVariant.amount);
            convertedQuantity = convertedQuantity * formValues.quantity;
        } else {
            convertedQuantity = formValues.units ? convertUnits(formValues.units, selectedInventory.unit, formValues.quantity) : formValues.quantity;
        }


        const newQuantity = parseFloat(selectedInventory.quantity) + parseFloat(convertedQuantity);
        

        setConfirmationData({
            name: formValues.name,
            quantity: newQuantity,
            newQuantity: `${newQuantity} ${selectedInventory.unit}`,
        });

        // Show the confirmation popup
        setShowConfirmation(true)
    };

    // Function to handle form submission after confirmation
    const handleConfirmationSubmit = () => {
        const newIncrease_Inventory = {
            newDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
            userId: user,
            inventoryId: inventory.find((i) => i.ingredientName === formValues.name).inventoryId,
            quantity: formValues.quantity,
            unit: formValues.units,
        };

        const updateInventoryQuantity = {
            inventoryId: inventory.find((i) => i.ingredientName === formValues.name).inventoryId,
            quantity: confirmationData?.quantity,
        };


        postIncreaseInventory(newIncrease_Inventory);
        patchInventory(updateInventoryQuantity);

        // Reset the form values
        setFormValues({
            name: '',
            variant: '',
            quantity: '',
            units: '',
        });

        // Hide the confirmation popup
        setShowConfirmation(false);
    };

    const convertUnits = (fromUnit, toUnit, quantity) => {
        const conversion = conversions.find(
            (conversion) => conversion.from_unit == fromUnit && conversion.to_unit == toUnit
        );

        if (!conversion) {
            console.log('Conversion not found!');
            
            return quantity; // Return the original quantity if conversion not found
        }

        return quantity * conversion.to_quantity;
    };


    const handleCancelOrder = () => {
        // Clear the form values
        setFormValues({
          name: '',
          variant: '',
          quantity: '',
          units: '',
        });
    
        // Hide the confirmation popup
        setShowConfirmation(false);
      };

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


    useEffect(() => {
        async function getVariant() {
            try { 
                const data = await fetchAPI(`/api/variation/getVariant?inventoryId=${selectedInventoryId}`);
                setVariant(data);
            } catch (err) {
                console.error(err);
            }
        }
    
        if (selectedInventoryId)
            getVariant();
    }, [selectedInventoryId]);


    async function postIncreaseInventory(newIncrease_Inventory) {
        try {
            const data = await postAPI('/api/inventory/postIncreaseInventory', newIncrease_Inventory);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async function patchInventory(updateInventoryQuantity) {
        try {
            const data = await patchAPI('/api/inventory/patchInventory', updateInventoryQuantity);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    const isVariantSelected = () => {
        return formValues.variant !== '';
      };

    return (
        <div className='add-inventory-form'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name"> Ingredient Name <span>* </span>
                        {formValues.name && (
                            <span className="current-quantity">
                                {/* Add a heading of Current Quantity of <Name>  */}
                                    Current Quantity: {inventory.find((i) => i.ingredientName === formValues.name)?.quantity} {inventory.find((i) => i.ingredientName === formValues.name)?.unit}
                            </span>
                        )}
                    </label>
                    <select
                        type="text"
                        name="name"
                        id="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Ingredient</option>
                        {inventory.map((i) => (
                            <option key={i.inventoryId} value={i.ingredientName}>
                                {i.ingredientName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <div className="sub-group"></div>
                    <label htmlFor="name"> Variant<span>* </span>
                    </label>
                    <select
                        type="text"
                        name="variant"
                        id="variant"
                        value={formValues.variant}
                        onChange={handleInputChange}
                    >
                        {/* If variant.length is < 1 say no variant */}
                        <option value="" hidden>
                            {variant.length < 1 ? 'No Variant' : 'Select Variant'}
                        </option>
                        {variant.map((i) => (
                            <option key={i.variationId} value={i.variationName}>
                                {i.variationName}
                            </option>
                        ))}
                    </select>
                    <button type="button" onClick={() => router.push(`/variants/addVariant?ingredientId=${selectedInventoryId}`)}>
                        Add New Variant
                    </button>
                </div>
        
                <div className="form-group">
                    <label htmlFor="quantity">Quantity <span>* </span>
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={formValues.quantity}
                        onChange={handleInputChange}
                    />
                </div>
                {/* {variant.length < 1 && ( */}
                {/* Add the condition to disable "Unit Measurement" when a variant is selected */}
                {!isVariantSelected() && (
                    <div className="form-group">
                        <label htmlFor="quantity">
                            Unit Measurement<span>* </span>
                        </label>
                        <select
                            type="text"
                            name="units"
                            id="units"
                            value={formValues.units}
                            onChange={handleInputChange}
                        >
                            <option value="" hidden>
                                Select Unit
                            </option>
                            {units.map((i) => (
                                <option key={i.unitshort} value={i.unitshort}>
                                    {i.unitshort}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                { }
                <button type="button" 
                    onClick={
                        () => router.push('/inventory')
                    }> Cancel</button>
                <button type="submit">Save</button>
                {showConfirmation && (
                    <div className='confirmation-popup'>
                        <p>Updated {confirmationData?.name}</p>
                        <p>New Quantity: {confirmationData?.newQuantity}</p>
                        <button onClick={handleConfirmationSubmit}>Confirm Record</button>
                        <button onClick={handleCancelOrder}>Cancel Record</button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default ReplenishStockForm