import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getVariants);

async function getVariants(req, res) {
    try {
        let { data: ingredients, error } = await supabase
            .from('variation')
            .select(`
                variationId,
                inventory (inventoryId, ingredientName), 
                variationName,
                amount,
                unit
            `);

        if (error) {
            throw error;
        }

        res.send(ingredients);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}