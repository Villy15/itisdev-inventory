import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Table from "@components/Table";

import { withSessionSsr } from "@lib/withSession";
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

const Reports = ({
  user
}) => {
  const [expired, setExpired] = useState([]); // [
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchExpired();
    fetchReports();
  }, []);

  // fetchReports
  async function fetchReports() {
    try {
      const response = await fetch('/api/reports/getReports', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  }


  async function fetchExpired() {
    try {
      const response = await fetch('/api/reports/getExpired', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setExpired(data);
    } catch (err) {
      console.error(err);
    }
  }




  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"Reports"} user={user} />
        <div className="reports">
          <h1>Expired</h1>
          <Table data={expired} />
          <h1>Audit Physical Count</h1>
          <Table data={reports} />
        </div>
      </div>
    </main>
  )
}

export default Reports;