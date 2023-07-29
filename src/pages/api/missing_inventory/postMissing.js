import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postMissing);

async function postMissing(req, res) {
    try {
        const newList = await req.body;

        const { data, error } = await supabase
            .from("missing_inventory")
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