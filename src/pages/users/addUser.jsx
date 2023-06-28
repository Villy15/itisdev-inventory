import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import AddUserForm from "@components/Users/AddUserForm";

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
    
    if (user.role !== "Manager") {
        return (
            <div className="main-section">
                <Header page={"Add New User"} user={user} />
                <h1>Access Denied</h1>
            </div>
        )
    } 

    return (
        <main>
            <Sidebar role={user.role}/>
            <div className="main-section">
                <Header page={"Add New User"} user={user} />
                <AddUserForm />
            </div>
        </main>
    )
}

export default AddInventory;