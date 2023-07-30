import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import ChangePasswordForm from "@components/Users/ChangePasswordForm";
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
    const { id } = router.query;
    
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
                <Header page={"Change Password"} user={user} />
                <ChangePasswordForm id={id} />
            </div>
        </main>
    )
}

export default AddInventory;