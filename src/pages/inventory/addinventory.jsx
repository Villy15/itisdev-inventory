import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import AddInventoryForm from "@components/Inventory/AddInventoryForm";
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

const AddInventory = ({
    user
}) => {
    const router = useRouter();
    useEffect(() => {
        console.log(user.role);
        if (user.role !== "Chef" && user.role !== "Manager") {
            router.push("/login");
        } 
      }, [user, router]);

    return (
        <main>
            <Sidebar role={user.role}/>
            <div className="main-section">
                <Header page={"Add New Ingredient"} user={user} />
                <AddInventoryForm />
            </div>
        </main>
    )
}

export default AddInventory;