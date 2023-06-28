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

  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    } else {
      getDish();
    }
  }, [user, router]);

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
              <div className="dishes">
                {dishes.map((dish) => (
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
          </div>
        </div>
      </main>
    </>
  )
}
