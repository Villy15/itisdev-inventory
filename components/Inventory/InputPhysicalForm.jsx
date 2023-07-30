import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';


const InputPhysicalForm = ({ user }) => {
    const router = useRouter();

    const [inventory, setInventory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const [physicalCount, setPhysicalCount] = useState([]);
    const [currentInventory, setCurrentInventory] = useState([]);

    const [missingInventory, setMissingInventory] = useState([]);

    const [variant, setVariant] = useState([]);
    const [ingredientVariants, setIngredientVariants] = useState({});
    const [units, setUnits] = useState([]); // A

    const [conversions, setConversions] = useState([]);

    useEffect(() => {
        getInventory();
        getPhysicalCount();
        getMissing();
        getVariant();
        getUnits();
        getConversions();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleQuantityChange = (index, value, selectedUnit) => {
        const updatedInventory = [...inventory];
        const indexOfFirstItemOnPage = (currentPage - 1) * itemsPerPage;
        const actualIndex = indexOfFirstItemOnPage + index;
        updatedInventory[actualIndex].quantity = value;
    
        // Update the selected unit for the specific row
        updatedInventory[actualIndex].unit = selectedUnit;
    
        setInventory(updatedInventory);
      };

    const handleSubmit = async () => {
        const filteredInventory = inventory.filter((item) => item.quantity != '');
        const maxSheetNumber = Math.max(...physicalCount.map((item) => item.sheet_number)) + 1;
        let missingId = Math.max(...missingInventory.map((item) => item.missingId)) + 1;

        const newPhysicalCount = {
            sheet_number: maxSheetNumber,
            userId: user,
            updateDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
        };

        await postPhysicalCount(newPhysicalCount);

        for (const item of filteredInventory) {
            
            
            const newPhysicalCountItem = {
                sheet_number: maxSheetNumber,
                ingredientId: item.inventoryId,
                quantity: item.quantity,
                unit: item.unit,
            };

            if (item.variant) {
                const selectedVariant = variant.find((v) => v.variationName === item.variant);
                const inventoryUnit = currentInventory.find((inventory) => inventory.inventoryId == item.inventoryId).unit;

                const convertedQuantity = convertUnits(selectedVariant.unit, inventoryUnit, selectedVariant.amount);
                console.log("Selected Variant : " + selectedVariant.unit);
                console.log("Inventory Unit : " + inventoryUnit);
                console.log("Selected Variant Quantity : " + selectedVariant.amount);

                console.log("Converted Quantity : " + convertedQuantity);

                newPhysicalCountItem.quantity = convertedQuantity * item.quantity;
                newPhysicalCountItem.unit = inventoryUnit;
            } else {
                // No variant selected, perform conversion based on selected unit (if any)
                if (item.unit) {
                    const inventoryUnit = currentInventory.find((inventory) => inventory.inventoryId == item.inventoryId).unit;

                    const convertedQuantity = convertUnits(item.unit, inventoryUnit, item.quantity);
                    console.log("Selected Unit : " + item.unit);
                    console.log("Inventory Unit : " + inventoryUnit);
                    console.log("Selected Quantity : " + item.quantity);

                    newPhysicalCountItem.quantity = convertedQuantity;
                    newPhysicalCountItem.unit = inventoryUnit;
                } else {
                    // No variant and unit selected, use the quantity as it is
                    newPhysicalCountItem.quantity = item.quantity;
                    newPhysicalCountItem.unit = currentInventory.find((inventory) => inventory.inventoryId == item.inventoryId).unit;
                }
            }

            console.log(newPhysicalCountItem);
            await postPhysicalCountList(newPhysicalCountItem);

            // MISSING INVENTORY
            const currentQuantity = currentInventory.find((inventory) => inventory.inventoryId == item.inventoryId).quantity;
            const descrepancyQuantity = currentQuantity - newPhysicalCountItem.quantity ;

            const newMissingInventory = {
                missingId: missingId,
                inventoryId: item.inventoryId,
                quantity: descrepancyQuantity,
                unit: newPhysicalCountItem.unit,
                newDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
                userId: user
            };

            console.log(newMissingInventory);

            await postMissing(newMissingInventory);

            missingId += 1;
        }
    }
    

    useEffect(() => {
        // After fetching the variants, update ingredientVariants whenever variant changes
        const ingredientVariantsMap = {};
        inventory.forEach((item) => {
            ingredientVariantsMap[item.inventoryId] = variant.filter((v) => v.inventory.inventoryId === item.inventoryId);
        });
        setIngredientVariants(ingredientVariantsMap);
    }, [variant, inventory]);

    async function getInventory() {
        try {
            const data = await fetchAPI("/api/inventory/getInventoryWithId");
            const inventoryWithInitialQuantity = data.map((item) => ({ ...item, quantity: '', variant: '' })); // Add variant property
            setInventory(inventoryWithInitialQuantity);
            setCurrentInventory(data);

            // ... Rest of the code ...
        } catch (err) {
            console.error(err);
        }
    }

    async function getPhysicalCount() {
        try {
            const data = await fetchAPI("/api/physical_count/getPhysicalCount");
            setPhysicalCount(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function postPhysicalCount(newPhysicalCount) {
        try {
            const data = await postAPI("/api/physical_count/postPhysicalCount", newPhysicalCount);
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function postPhysicalCountList(newPhysicalCountList) {
        try {
            const data = await postAPI("/api/physical_count_list/postPhysicalCountList", newPhysicalCountList);
            console.log(data);
        } catch (err) {
            console.error(err);
        }

    }

    async function getMissing() {
        try {
            const data = await fetchAPI("/api/missing_inventory/getMissing");
            setMissingInventory(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function postMissing(newMissing) {
        try {
            const data = await postAPI("/api/missing_inventory/postMissing", newMissing);
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function getVariant() {
        try {
            const data = await fetchAPI(`/api/variation/getAllVariantswId`);
            setVariant(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function getUnits() {
        try {
            const data = await fetchAPI(`/api/units_table/getUnits`);
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

    const handleVariantChange = (index, variantName) => {
        const updatedInventory = [...inventory];
        const indexOfFirstItemOnPage = (currentPage - 1) * itemsPerPage;
        const actualIndex = indexOfFirstItemOnPage + index;

        // Set the selected variant for the specific row
        updatedInventory[actualIndex].variant = variantName;

        // Clear the unit selection when a variant is selected
        updatedInventory[actualIndex].unit = '';

        setInventory(updatedInventory);
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

    return (
        <div className='add-inventory-form'>
            <div className="ingredients-table">
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Variant Option</th>
                            <th>Unit of Measurement</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((inventory, index) => (
                            <tr key={index}>
                                <td className='row-left'>
                                    {inventory.ingredientName}
                                </td>
                                <td>
                                    <select
                                        type="text"
                                        name="variant"
                                        id="variant"
                                        style={{ width: '400px' }}
                                        onChange={(e) => handleVariantChange(index, e.target.value)} // Handle variant selection
                                    >
                                        <option value="" hidden>
                                            {ingredientVariants[inventory.inventoryId]?.length < 1
                                                ? 'No Variant'
                                                : 'Select Variant'}
                                        </option>
                                        {ingredientVariants[inventory.inventoryId]?.map((i) => (
                                            <option key={i.variationId} value={i.variationName}>
                                                {i.variationName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        type="text"
                                        name={`unit-${index}`}
                                        id={`unit-${index}`}
                                        style={{ width: '250px' }}
                                        disabled={!!inventory.variant} // Disable the select when a variant is selected
                                        value={inventory.unit} // Set the value to the current unit
                                        onChange={(e) => handleQuantityChange(index, inventory.quantity, e.target.value)} // Handle unit selection
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
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name={`quantity-${index}`}
                                        value={inventory.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={inventory.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
                <button type="button"
                    onClick={
                        () => router.push('/inventory')
                    }> Cancel</button>
                <button type="submit"
                    onClick={
                        () => handleSubmit()
                    }
                >Save</button>
            </div>
        </div>
    )
}

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        console.log(currentPage);
    }, [currentPage]);

    return (
        <ul className="pagination">
            {pageNumbers.map((number) => (
                <li key={number}>
                    <a onClick={() => paginate(number)} className={`${number === currentPage ? 'active' : ''}`}>
                        {number}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default InputPhysicalForm