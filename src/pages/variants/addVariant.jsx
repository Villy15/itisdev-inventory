import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import AddVariantForm from "@components/Variant/AddVariantForm";

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

const AddVariant = ({
    user
}) => {
    return (
        <main>
            <Sidebar role={user.role}/>
            <div className="main-section">
                <Header page={"Add New Variant"} user={user} />
                <AddVariantForm user={user.id}/>                
            </div>
        </main>
    )
}

export default AddVariant;