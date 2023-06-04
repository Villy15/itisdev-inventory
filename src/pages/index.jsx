import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

import { withSessionSsr } from "@lib/withSession";

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

  return (
    <>
      <main>
        <Sidebar />
        <div className="main-section">
          <Header page={"Dashboard"} user={user} />
        </div>
      </main>
    </>
  )
}
