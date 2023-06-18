import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import ReplenishStockForm from "@components/Inventory/ReplenishStockForm";

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
    return (
        <main>
            <Sidebar role={user.role}/>
            <div className="main-section">
                <Header page={"Replenish Inventory Stock"} user={user} />
                <ReplenishStockForm user={user.id}/>                
            </div>
        </main>
    )
}

export default ReplenishStock;