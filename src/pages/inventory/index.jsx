import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";

import Link from "next/link";
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

const Inventory = ({
  user
}) => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetchIngredients();
  }, []);
  
  async function fetchIngredients() {
    try {
      const response = await fetch('/api/inventory/getIngredients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setIngredients(data);       
    } catch (err) {
      console.error(err);
    }
  }
  
  return (
    <main>
      <Sidebar role={user.role}/>
      <div className="main-section">
        <Header page={"Inventory"} user={user} />
        <div className="inventory">

          {/* Add input search*/}
          <input 
            type="text" 
            placeholder="Search Name"
            className="search"
          />
          <Table data={ingredients} />
          <Link href="/inventory/add" >
            <button className="margin-b">Add</button>
          </Link>
          <Link href="/inventory/expired" className="margin-b">
            <button className="margin-b">Input Expired</button>
          </Link>
          <Link href="/inventory/physicalcount" className="margin-b">
            <button className="margin-b">Input Physical Count</button>
          </Link>
        </div>
      </div>

    </main>
  )
}

export default Inventory;