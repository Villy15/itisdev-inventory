import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getOrders);

async function getOrders(req, res) {
    try {
        let { data: orders, error } = await supabase
            .from('order')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(orders);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}