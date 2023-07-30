import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    let user = req.session.user;

    console.log(user);
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

;

  useEffect(() => {
    console.log(user.role);
    if (user.role !== "Manager") {
        router.push("/login");
    } 
  }, [user, router]);



  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"Dashboard"} user={user} />
        <div className="dashboard-manager">
          
        </div>
      </div>
    </main>
  )
}

export default Reports;