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

    useEffect(() => {
        getInventory();
        getPhysicalCount();
        getMissing();
    }, []);
    
    useEffect(() => {
        // console.log(inventory);
        // console.log(physicalCount);
    }, [inventory, physicalCount]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleQuantityChange = (index, value) => {
        const updatedInventory = [...inventory];
        updatedInventory[index].quantity = value;
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

            await postPhysicalCountList(newPhysicalCountItem);

            // MISSING INVENTORY
            const currentQuantity = currentInventory.find((inventory) => inventory.inventoryId == item.inventoryId).quantity;
            const descrepancyQuantity = currentQuantity - item.quantity;

            const newMissingInventory = {
                missingId: missingId,
                inventoryId: item.inventoryId,
                quantity: descrepancyQuantity,
                unit: item.unit,
                newDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
                userId: user
            };

            console.log(newMissingInventory);

            await postMissing(newMissingInventory);

            missingId += 1;
        }
    }

    async function getInventory() {
        try {
            const data = await fetchAPI("/api/inventory/getInventoryWithId");
            const inventoryWithInitialQuantity = data.map((item) => ({ ...item, quantity: '' }));
            setInventory(inventoryWithInitialQuantity);
            setCurrentInventory(data);
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

    return (
        <div className='add-inventory-form'>
            <div className="ingredients-table">
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Unit of Measurement</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((inventory, index) => (
                            <tr key={index}>
                                <td>
                                    {inventory.ingredientName}
                                </td>
                                <td>
                                    {inventory.unit}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name={`quantity-${index}`} // Use a unique identifier based on the index
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