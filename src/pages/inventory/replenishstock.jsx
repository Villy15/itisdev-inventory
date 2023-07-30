import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import ReplenishStockForm from "@components/Inventory/ReplenishStockForm";
import { useEffect } from "react";
import { useRouter } from "next/router";

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

const ReplenishStock = ({
    user
}) => {
    const router = useRouter();
    
    useEffect(() => {
        console.log(user.role);
        if (user.role !== "Stock Controller" && user.role !== "Manager") {
            router.push("/login");
        } 
      }, [user, router]);

    return (
        <main>
            <Sidebar role={user.role}/>
            <div className="main-section">
                <Header page={"Record Purchase"} user={user} />
                <ReplenishStockForm user={user.id}/>                
            </div>
        </main>
    )
}

export default ReplenishStock;