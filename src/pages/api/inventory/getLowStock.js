import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getLowStock);

async function getLowStock(req, res) {
    try {
        let { data: ingredients, error } = await supabase
            .from('inventory')
            .select(`
                inventoryId,
                ingredientName,
                quantity,
                unit,
                minquantity
            `)
            // .filter('quantity', 'lt', 'minquantity')
            .order('ingredientName', { ascending: true });

        if (error) {
            throw error;
        }

        res.send(ingredients);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}