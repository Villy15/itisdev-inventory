import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";


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

export default function Users({ user }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('/api/users/getUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    } else if (user.role === "Manager") {
      setIsAuthenticated(true);
    }
  }, [user, router]);

  if (!isAuthenticated) {
    return (
      <main>
        <Sidebar role={user.role} />
        <div className="main-section">
          <Header page={"Dashboard"} user={user} />
          <h1>Access Denied</h1>
        </div>
      </main>

    )
  }

  return (
    <>
      <main>
        <Sidebar role={user.role} />
        <div className="main-section">
          <Header page={"Users"} user={user} />
          <div className="users">
            <Table data={users} />
          </div>
        </div>
      </main>
    </>
  )
}
