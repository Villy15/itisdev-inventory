import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

import { withSessionSsr } from "@lib/withSession";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

export default function POS({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (user.role === "Guest") {
      router.push("/login");
    }
  }, [user, router]);


  return (
    <>
      <main>
        <Sidebar role={user.role}/>
        <div className="main-section">
          <Header page={"POS"} user={user} />
        </div>
      </main>
    </>
  )
}
