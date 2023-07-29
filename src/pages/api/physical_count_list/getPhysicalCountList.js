import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getPhysicalCountList);

async function getPhysicalCountList(req, res) {
    try {
        let { data: users, error } = await supabase
            .from('physical_count_list')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(users);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}