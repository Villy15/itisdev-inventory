import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getOrders);

async function getOrders(req, res) {
    try {
        const { orderId } = req.query;
        
        let { data: orders, error } = await supabase
            .from('order')
            .select(`
                orderDate,
                totalPrice,
                users(id, lastname)
            `)
            .eq('orderId', orderId)
            .order('orderDate', { ascending: false });

        if (error) {
            throw error;
        }

        res.send(orders);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}