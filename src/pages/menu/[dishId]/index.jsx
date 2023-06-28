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

export default function Dish({ user }) {
  const router = useRouter();
  const dishId = router.query.dishId;

  const [dishes, setDishes] = useState([]);
  const [dish, setDish] = useState({});


  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    } else {
      getDish();
    }
  }, [user, router]);

  

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
    } catch (err) {
      console.error(err);
    }
  }

    useEffect(() => {
        if (dishes.length > 0) {
            const dish = dishes.find(dish => dish.dishId == dishId);
            setDish(dish);
        }

        console.log(dish);

    }, [dishes, dishId, dish]);
        
  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
            <Header page={"Dish"} user={user} />
            {/* add header of dish.dishName */}
            <h1>{dish.dishName}</h1>
        </div>
      </main>
    </>
  )
}
