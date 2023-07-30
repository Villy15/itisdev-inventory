
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import InputPhysicalForm from "@components/Inventory/InputPhysicalForm";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

const InputPhysicalCount = ({
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
                <Header page={"Input Physical Count"} user={user} />
                <InputPhysicalForm user={user.id}/>                
            </div>
        </main>
    )
}

export default InputPhysicalCount;