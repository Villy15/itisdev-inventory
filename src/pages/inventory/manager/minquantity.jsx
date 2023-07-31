import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';

import { withSessionSsr } from "@lib/withSession";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req, res }) {
    let user = req.session.user;

    if (!user) {
        user = {
            role: "Guest",
        };
    }

    return {
        props: {
            user,
        },
    };
});

const Inventory = ({ user }) => {
    const router = useRouter();


    useEffect(() => {
        console.log(user.role);
        if (user.role !== "Stock Controller" && user.role !== "Manager") {
            router.push("/login");
        } 
      }, [user, router]);

    const [originalInventory, setOriginalInventory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [lowStockInventory, setLowStockInventory] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;

    const [lowStockCount, setLowStockCount] = useState(0);
    const [outOfStockCount, setOutOfStockCount] = useState(0);
    const [inStockCount, setInStockCount] = useState(0);

    const [updatedMinQuantities, setUpdatedMinQuantities] = useState({});

    const [selectedFilter, setSelectedFilter] = useState('all');
    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'lowStock', label: 'Low Stock' },
        { value: 'outOfStock', label: 'Out of Stock' },
        { value: 'inStock', label: 'In Stock'}
    ];

    useEffect(() => {
        getInventory();
    }, []);
    

    async function getInventory() {
        try {
            const data = await fetchAPI("/api/inventory/getLowStock");

            const lowStock = data;
            setOriginalInventory(lowStock);
            setLowStockInventory(lowStock);

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const filteredInventory = originalInventory.filter((item) =>
            item.ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
        // Apply the selected filter on top of the search filter
        if (selectedFilter === 'lowStock') {
            const lowStockItems = filteredInventory.filter(item => item.quantity < item.minquantity && item.quantity != 0);
            setLowStockInventory(lowStockItems);
        } else if (selectedFilter === 'outOfStock') {
            const outOfStockItems = filteredInventory.filter(item => item.quantity == 0);
            setLowStockInventory(outOfStockItems);
        } else if (selectedFilter === 'inStock') {
            const inStockItems = filteredInventory.filter(item => item.quantity > item.minquantity);
            setLowStockInventory(inStockItems);
        } else {
            // Show all items when 'All' is selected
            setLowStockInventory(filteredInventory);
        }
    
        setCurrentPage(1);
    }, [searchQuery, selectedFilter, originalInventory]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = lowStockInventory.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            // If the search query is empty, revert back to the original inventory
            setLowStockInventory(originalInventory);
        }
    };

    const handleFilterChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedFilter(selectedValue);

        // Apply filter based on the selected value
        
        if (selectedValue === 'lowStock') {
            const lowStockItems = originalInventory.filter(item => item.quantity < item.minquantity);
            setLowStockInventory(lowStockItems);
        } else if (selectedValue === 'outOfStock') {
            const outOfStockItems = originalInventory.filter(item => item.quantity === 0);
            setLowStockInventory(outOfStockItems);
        } else {
            // Show all items when 'All' is selected
            setLowStockInventory(originalInventory);
        }
    };


    const handleMinQuantityChange = (event, ingredientName) => {
        const { value } = event.target;
        setUpdatedMinQuantities((prev) => ({
          ...prev,
          [ingredientName]: value,
        }));
      };
      const handleSubmitMinQuantities = async () => {
        // Create an array to hold all the promises for patchQuantity requests
        const patchPromises = [];
    
        // Update the minquantities in the backend for all items
        for (const [inventoryId, minquantity] of Object.entries(updatedMinQuantities)) {
          const newpatchQuantity = {
            inventoryId: inventoryId,
            minquantity: parseFloat(minquantity),
          };
    
          // Collect all the promises in the array
          patchPromises.push(patchQuantity(newpatchQuantity));
        }
    
        try {
          // Wait for all the promises to resolve
          await Promise.all(patchPromises);
          console.log("All minquantities updated successfully.");
    
          // Redirect to the desired page
          router.push("/inventory/manager/");
        } catch (error) {
          console.error("Error updating minquantities:", error);
        }
      };

    // Set default values for updatedMinQuantities when it's null
    useEffect(() => {
        if (lowStockInventory.length > 0) {
            const defaultMinQuantities = lowStockInventory.reduce((acc, inventory) => {
                acc[inventory.inventoryId] = inventory.minquantity;
                return acc;
            }, {});
            setUpdatedMinQuantities(defaultMinQuantities);
        }
    }, [lowStockInventory]);

    
    async function patchQuantity(newQuantity) {
        try {
            const data = await patchAPI("/api/inventory/patchQuantity", newQuantity);
            console.log(data);
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <main>
            <Sidebar role={user.role} />
            <div className="main-section ">
                <Header page="Change Inventory Minimum Quantity" user={user} />
                <div className="smaller-width">
                    <div className="inventory">
                        <div className="inventory-functions">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search Name"
                                    className="search"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ingredient Name</th>
                                    <th>Unit of Measurement</th>
                                    <th>Quantity</th>
                                    <th>Minimum Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((inventory, index) => (
                                    <tr key={index}>
                                        <td className="row-left">
                                            {inventory.ingredientName}
                                        </td>
                                        <td className="row-left">
                                            {inventory.unit}
                                        </td>
                                        <td className="row-right">
                                            {inventory.quantity}
                                        </td>
                                        <td className="row-right">
                                            {/* Display the minquantity input and bind its value to the updatedMinQuantities state */}
                                            <input
                                                type="number"
                                                value={updatedMinQuantities[inventory.inventoryId] || ''}
                                                onChange={(e) => handleMinQuantityChange(e, inventory.inventoryId)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={lowStockInventory.length}
                            currentPage={currentPage}
                            paginate={paginate}
                        />
                        {/* Add legend info */}
                        {/* Add the submit button to update minquantities */}
                        <button onClick={handleSubmitMinQuantities}>Update MinQuantities</button>
                        {/* ... */}
                    </div>
                </div>
            </div>
        </main>
    );
};

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

export default Inventory;
