import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getPhysicalCountList);

async function getPhysicalCountList(req, res) {
    try {
        const { orderId } = req.query;

        let { data: users, error } = await supabase
            .from('order_item')
            .select(`
                dish(dishName, price),
                quantity
            `)
            .eq('orderId', orderId);

        if (error) {
            throw error;
        }

        res.send(users);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}