import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getUsers);

async function getUsers(req, res) {
    const { userId } = req.query;

    try {
        let { data: users, error } = await supabase
            .from('users')
            .select(`
                *
            `)
            .eq('id', userId);

        if (error) {
            throw error;
        }

        res.send(users);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}