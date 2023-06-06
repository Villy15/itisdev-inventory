import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postReport);

async function postReport(req, res) {
    try {
        const report = await req.body;
        console.log(report);

        const { data, error } = await supabase
            .from("reports")
            .insert(report);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}