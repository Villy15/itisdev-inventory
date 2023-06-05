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

const Reports = ({
    user
}) => {
    return (
        <main>
            <Sidebar role={user.role}/>
            <div className="main-section">
                <Header page={"Reports"} user={user} />
            </div>
        </main>
    )
}

export default Reports;