import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getExpired);

async function getExpired(req, res) {
    try {
        let { data: reports, error } = await supabase
            .from('expired')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(reports);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}