import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Image from "next/image";

import { withSessionSsr } from "@lib/withSession";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

export default function Menu({ user }) {
  const router = useRouter();

  const [originalDishes, setOriginalDishes] = useState([]); // original inventory
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');


  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      // If the search query is empty, revert back to the original inventory
      setDishes(originalDishes);
    }
  };

  useEffect(() => {
    console.log(user.role);
    if (user.role !== "Chef" && user.role !== "Manager") {
        router.push("/login");
    } else {
      getDish();
    }
  }, [user, router]);



  useEffect(() => {
    const filteredDishes = originalDishes.filter((dish) =>
      dish.dishName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCurrentPage(1);
    setDishes(filteredDishes);
  }, [searchQuery, originalDishes]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dishes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleClick = (dishId) => {
    router.push(`/menu/${dishId}`);
  }

  async function getDish() {
    try {
      const response = await fetch('/api/dish/getDish', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setDishes(data);       
      setOriginalDishes(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
          <Header page={"Menu"} user={user} />
          <div className="menu">
            <input
              type="text"
              placeholder="Search Name"
              className="search"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="dishes">
              {currentItems.map((dish) => (
                <button key={dish.id} onClick={() => handleClick(dish.dishId)}>
                  <div className="dish-item">
                    <div className="dish-image">
                      <Image alt="image" src={`/images/${dish.dishPhoto}.jpg`} width={200} height={200}></Image>
                    </div>
                    <div className="dish-name">{dish.dishName}</div>
                  </div>
                </button>
              ))}
            </div>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={dishes.length}
                currentPage={currentPage}
                paginate={paginate}
              />
          </div>
        </div>
      </main>
    </>
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