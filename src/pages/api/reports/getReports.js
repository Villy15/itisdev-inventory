import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getReports);

async function getReports(req, res) {
    try {
        let { data: reports, error } = await supabase
            .from('reports')
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