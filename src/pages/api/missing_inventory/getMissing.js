import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getMissing);

async function getMissing(req, res) {
    try {
        let { data: users, error } = await supabase
            .from('missing_inventory')
            .select(`
                *
            `);

        if (error) {
            throw error;
        }

        res.send(users);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}