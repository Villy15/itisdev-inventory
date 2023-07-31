import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getUsers);

async function getUsers(req, res) {
    try {
        let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('enable', true)
            .order('firstname', true);

        if (error) {
            throw error;
        }

        res.send(users);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}