import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';
import Link from "next/link";

import { withSessionSsr } from "@lib/withSession";
import { useState, useEffect } from "react";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    let user = req.session.user;

    if (!user) {
      user = {
        role: "Guest",
      }
    }

    return {
      props: {
        user,
      },
    };
  }
);

const Reports = ({
  user
}) => {
  const [originalIncreased, setOriginalIncreased] = useState([]); 
  const [increased, setIncreased] = useState([]);
  const [filteredIncreased, setFilteredIncreased] = useState([]); 
  const [conversions, setConversion] = useState([]);

  // Pages
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const [inventorylist, setInventory] = useState([]);

  useEffect(() => {
    getCoversion();
    getInventory();
  }, []);

  useEffect(() => {

    async function getIncreased() {
      try {
        const data = await fetchAPI("/api/reports/getMissing");
        setIncreased(data);
        setOriginalIncreased(data);
    
        // Get total of each ingredient by date
        const aggregatedData = {};
    
        for (const item of data) {
          const { inventory, newDate, quantity, unit} = item;
          const date = newDate.split("T")[0]; // Split and keep only the date part
          const key = `${inventory.ingredientName}_${date}`;
          
          
          const inventoryId = inventory.inventoryId;
          const inventoryUnit = inventorylist.find((i) => i.inventoryId == inventoryId).unit;
        
          const convertedQuantity = convertUnits(unit, inventoryUnit, quantity);

          // console.log("Unit: " + unit);
          // console.log("Inventory Unit: " + inventoryUnit);
          // console.log("Quantity: " + quantity);
          // console.log("Converted Quantity: " + convertedQuantity);
    
          if (!aggregatedData[key]) {

            aggregatedData[key] = {
              ingredientName: inventory.ingredientName,
              date: date,
              quantity: convertedQuantity,
              unit: inventoryUnit,
              inventoryId: inventoryId,
            };
          } else {
            aggregatedData[key].quantity += convertedQuantity;
          }
        }
    
        const filteredData = Object.values(aggregatedData);
        setFilteredIncreased(filteredData);
      } catch (err) {
        console.error(err);
      }
    }

    getIncreased();

    const convertUnits = (fromUnit, toUnit, quantity) => {
      console.log(fromUnit, toUnit, quantity);
      const conversion = conversions.find(
        (conversion) => conversion.from_unit === fromUnit && conversion.to_unit === toUnit
      );
  
      if (!conversion) {
        console.log('Conversion not found!');
        return quantity; // Return the original quantity if conversion not found
      }
  
      return quantity * conversion.to_quantity;
    };
    
  }, [inventorylist, conversions]);

  useEffect(() => {
    console.log(increased);
  }, [increased]);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIncreased.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      // If the search query is empty, revert back to the original inventory
      // setIncreased(originalIncreased);
    }
  };

  async function getCoversion() {
    try {
      const data = await fetchAPI("/api/conversion_table/getConversions");
      setConversion(data);
    } catch (err) {
      console.error(err);
    }
  }

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

  async function getInventory() {
    try {
      const data = await fetchAPI("/api/inventory/getInventoryWithId");
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"View Missing Report"} user={user} />
        <div className="reports">
          <h1 className="margin-bottom">Missing Summary Report</h1>
          {/* <input
            type="text"
            placeholder="Search ItemName"
            className="search"
            value={searchQuery}
            onChange={handleSearch}
          /> */}
          <table>
            <thead>
              <tr>
                <th>Ingredient Name</th>
                <th>Date</th>
                <th>Total Quantity</th>
                <th>Unit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((i, index) => (
                <tr key={index}>
                  <td className="row-left">
                    {i.ingredientName}
                  </td>
                  <td>
                    {/* format date of  2023-07-28T14:06:58+00:00 to YYYY-MM-DD*/}
                    {i.date}
                  </td>
                  <td className="row-right">
                    {i.quantity}
                  </td>
                  <td className="row-left">
                    {i.unit}
                  </td>
                  <td>
                    <Link href={`/reports/missingaudit/${i.inventoryId}`} className="viewmore">
                      View More
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredIncreased.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      </div>
    </main>
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


export default Reports;