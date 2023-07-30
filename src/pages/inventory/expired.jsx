import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import InputExpiredForm from "@components/Inventory/InputExpiredForm";
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

const InputExpired = ({

    
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
                <Header page={"Input Expired Ingredient"} user={user} />
                <InputExpiredForm user={user.id}/>                
            </div>
        </main>
    )
}

export default InputExpired;