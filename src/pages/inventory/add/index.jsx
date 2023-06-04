import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import AddInventoryForm from "@components/Inventory/AddInventoryForm";

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
    return (
        <main>
            <Sidebar />
            <div className="main-section">
                <Header page={"Inventory"} user={user} />
                <AddInventoryForm />
            </div>
        </main>
    )
}

export default AddInventory;