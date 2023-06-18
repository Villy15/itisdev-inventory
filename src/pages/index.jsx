import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";
import { useRouter } from "next/router";
import { useEffect, useState} from "react";

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

export default function Home({ user }) {
  const router = useRouter();
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    } else if (user.role === "Cashier") {
      router.push("/pos");
    }
  }, [user, router]);

  useEffect(() => {
    getInventory();
  }, []);

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

      const ingredients = data
        .filter(({ quantity, minquantity }) => quantity < minquantity)
        .map(({ ingredientName, quantity, minquantity }) => ({
          ingredientName,
          quantity,
          minquantity,
        }));

      setInventory(ingredients);       
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
          <Header page={"Dashboard"} user={user} />
          <div className="dashboard">
            <div className="lowcount">
              <h1>Low Count Ingredients</h1>
              <Table data={inventory} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
