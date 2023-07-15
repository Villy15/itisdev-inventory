import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import AddDishForm from "@components/Dish/AddDishForm";

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

const AddDish = ({
    user
}) => {
    return (
        <main>
            <Sidebar role={user.role}/>
            <div className="main-section">
                <Header page={"Add New Inventory"} user={user} />
                <AddDishForm />
            </div>
        </main>
    )
}

export default AddDish;