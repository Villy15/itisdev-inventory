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

  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    } else if (user.role === "Cashier") {
      router.push("/pos");
    } else if (user.role === "Manager") {
      router.push("/dashboard/manager");
    
    } else if (user.role === "Chef") {
      router.push("/menu");
      
    } else if (user.role === "Stock Controller") {
      router.push("/dashboard/stock");
    }
  }, [user, router]);


  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
          <Header page={"Dashboard"} user={user} />
          <div className="dashboard">


          </div>
        </div>
      </main>
    </>
  )
}
