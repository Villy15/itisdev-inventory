import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';
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
  const [allUsers, setAllUsers] = useState([]); // For filtering

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRole, setSelectedRole] = useState("All");

  const handleRoleFilterChange = (event) => {
    setSelectedRole(event.target.value);
  };

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const data = await fetchAPI("/api/users/getUsers");
      setUsers(data);
      setAllUsers(data);
    } catch (err) {
      console.error(err);
    }

  }

  useEffect(() => {
    // Function to filter users based on the selected role
    console.log(allUsers);
    const filterUsersByRole = () => {
      if (selectedRole === "All") {
        setUsers(allUsers); // Reset the filter and show all users
      } else {
        const filteredUsers = allUsers.filter((user) => user.role === selectedRole);
        setUsers(filteredUsers);
      }
    };

    filterUsersByRole(); // Call the filtering function
  }, [selectedRole, allUsers]);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  
  return (
    <>
      <main>
        <Sidebar role={user.role} />
        <div className="main-section">
          <Header page={"Users"} user={user} />
          <div className="users">
            <div className="users-row">
              {/* Add User button */}
              <div>
                <label>Filter by Role: </label>
                <select value={selectedRole} onChange={handleRoleFilterChange}>
                  <option value="All">All Roles</option>
                  <option value="Manager">Manager</option>
                  <option value="Stock Controller">Stock Controller</option>
                  <option value="Chef">Chef</option>
                  <option value="Cashier">Cashier</option>
                  {/* Add more role options as needed */}
                </select>
              </div>
              <div>
                <Link href="/users/deleteUser">
                  <button>Delete User</button>
                </Link>
                <Link href="/users/addUser">
                  <button>Add User</button>
                </Link>
              </div>
            </div>
          <table>
            <thead>
              <tr>
                <th>Usernames</th>
                <th>Name</th>
                <th>Position</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((i, index) => (
                <tr key={index}>
                  <td className="row-left">
                    {i.username}
                  </td>
                  <td className="row-left">
                    {i.firstname} {i.lastname}
                  </td>
                  <td className="row-left">
                    {i.role}
                  </td>
                  <td>
                    {i.enable == true ? (
                      <div className="circle green" />
                    ) : (
                      <div className="circle red" />
                    )}
                  </td>
                  <td>
                    <Link href={`/users/editUser/${i.id}`}>
                      <button>Change Password</button>
                    </Link>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            <div className="legend">
              <div className="circle green" /> Active
              <div className="circle red" /> Inactive
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
