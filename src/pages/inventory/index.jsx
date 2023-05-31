"use client"

import Header from "../../../components/Header"
import Sidebar from "../../../components/Sidebar"

import { withSessionSsr } from "../../../lib/withSession";

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

const Inventory = ({
  user
}) => {
  return (
    <main>
      <Sidebar />
      <div className="main-section">
        <Header page={"Inventory"} user={user}/>
        <div className="inventory">
          <table>
            <thead>
              <tr>
                {/* {getTableHeaders()} */}
              </tr>
            </thead>
            <tbody>
              {/* {getTableData()} */}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  )
}

export default Inventory;