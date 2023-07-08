import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postOrder_Item);

async function postOrder_Item(req, res) {
    try {
        const newOrder_Item = await req.body;
        console.log(newOrder_Item);

        const { data, error } = await supabase
            .from("order_item")
            .insert(newOrder_Item);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}