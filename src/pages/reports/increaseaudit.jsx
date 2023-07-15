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
  const [increased, setIncreased] = useState([]);

  useEffect(() => {
    fetchIncreased();
  }, []);

  async function fetchIncreased() {
    try {
      const response = await fetch('/api/reports/getIncreased', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setIncreased(data);
    } catch (err) {
      console.error(err);
    }
  }

  const tableProps = {
    columns: [
      { label: 'Item name', key: 'inventoryId' },
      { label: 'Quantity', key: 'quantity' },
      { label: 'Unit of Measurement', key: 'unit' },
      { label: 'Date Submitted', key: 'newDate' },
      { label: 'Submitted by', key: 'userId' },
    ],
  };

  return (
    <main>
      <Sidebar role={user.role} />
      <div className="main-section">
        <Header page={"Reports"} user={user} />
        <div className="reports">
          <h1>Increase Audit</h1>
          <Table 
              data={increased}
              columns={tableProps.columns}
              currentPage={1}
              itemsPerPage={10}
             />
        </div>
      </div>
    </main>
  )
}

export default Reports;