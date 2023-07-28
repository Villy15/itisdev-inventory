import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postVariant);

async function postVariant(req, res) {
    try {
        const newVariant = await req.body;
        console.log("HELLO PO");

        const { data, error } = await supabase
            .from("variation")
            .insert(newVariant);
        
        if (error) {
            throw error;
        }

        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}