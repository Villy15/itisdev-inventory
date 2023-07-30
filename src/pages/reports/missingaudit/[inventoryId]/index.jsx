import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';

import { withSessionSsr } from "@lib/withSession";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import getUser from "@/api/users/getUser";

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

    const router = useRouter();
    const inventoryId = router.query.inventoryId;

    const [users, setUsers] = useState({});

    const [increased, setIncreased] = useState([]);
    const [originalIncreased, setOriginalIncreased] = useState([]); // For filtering by date

    // Pages
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = increased.slice(indexOfFirstItem, indexOfLastItem);

    const [startDate, setStartDate] = useState(''); // State to store the start date for filtering
    const [endDate, setEndDate] = useState('');    

    const handleDateFilterChange = (event) => {
        // Get the input field name and value
        const { name, value } = event.target;

        // Update the corresponding state based on the input field name
        if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };

    const applyDateFilter = () => {
        // Filter by date
        const filteredData = increased.filter((item) => {
            const date = item.newDate.slice(0, 10);
            return date >= startDate && date <= endDate;
        });

        setIncreased(filteredData);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        async function getIncreased() {
            try {
                const data = await fetchAPI(`/api/reports/getMissingId?inventoryId=${inventoryId}`);
                setIncreased(data);
                setOriginalIncreased(data);
            } catch (error) {
                console.log(error);
            }
        }
        getIncreased();
    }, [inventoryId]);

    useEffect(() => {
        console.log(startDate);
        console.log(endDate);
    }, [startDate, endDate]);
   
    
    return (
        <main>
            <Sidebar role={user.role} />
            <div className="main-section">
                <Header page={"Detaled Descrepancy Report"} user={user} />
                <div className="reports">
                    <div className="details">
                        <div className="row">
                            <div className="report-header">Ingredient Name: <span>{increased.length > 0 ? increased[0].inventory.ingredientName : ''}</span></div>
                        </div>
                        <div className="row">
                        </div>
                    </div>
                    {/* Filter by date */}
                    <div className="date-filter">
                        <input
                            type="date"
                            name="startDate"
                            value={startDate}
                            onChange={handleDateFilterChange}
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={endDate}
                            onChange={handleDateFilterChange}
                        />
                        <button onClick={() => applyDateFilter()}>Apply Filter</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Subbmited By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((i, index) => (
                                <tr key={index}>
                                    <td>
                                        {/* 2023-07-29T14:23:50+00:00 to  2023-07-29 2:23PM*/}
                                        {i.newDate.replace('T', ' ').slice(0, -6)}

                                    </td>
                                    <td className="row-right">
                                        {i.quantity < 0 ? `+${(i.quantity * -1).toFixed(2)}` : i.quantity.toFixed(2)}
                                    </td>
                                    <td className="row-left">
                                        {i.unit}
                                    </td>
                                    <td className="row-left">
                                        {i.users.lastname}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={increased.length}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                    <h1>END OF REPORT</h1>
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