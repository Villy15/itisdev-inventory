import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postDish);

async function postDish(req, res) {
    try {
        const newDish = await req.body;

        const { data, error } = await supabase
            .from("dish")
            .insert(newDish);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}