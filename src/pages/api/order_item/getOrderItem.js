import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getOrder_Items);

async function getOrder_Items(req, res) {
    try {
        let { data: items, error } = await supabase
            .from('order_item')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(items);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}