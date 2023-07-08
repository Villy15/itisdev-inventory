import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postOrder);

async function postOrder(req, res) {
    try {
        const newOrder = await req.body;
        console.log(newOrder);

        const { data, error } = await supabase
            .from("order")
            .insert(newOrder);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}