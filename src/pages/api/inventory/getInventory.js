import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getInventory);

async function getInventory(req, res) {
    try {
        let { data: ingredients, error } = await supabase
            .from('inventory')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(ingredients);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}