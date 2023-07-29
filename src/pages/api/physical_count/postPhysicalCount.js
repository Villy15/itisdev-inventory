import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postPhysicalCount);

async function postPhysicalCount(req, res) {
    try {
        const newList = await req.body;

        const { data, error } = await supabase
            .from("physical_count")
            .insert(newList);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}