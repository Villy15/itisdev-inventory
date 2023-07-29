import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getPhysicalCount);

async function getPhysicalCount(req, res) {
    try {
        let { data: users, error } = await supabase
            .from('physical_count')
            .select(`
                sheet_number,
                users(id, lastname),
                updateDate
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