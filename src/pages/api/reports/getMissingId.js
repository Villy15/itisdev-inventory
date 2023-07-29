import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getExpired);

async function getExpired(req, res) {
    try {
        const { inventoryId } = req.query;

        let { data: reports, error } = await supabase
            .from('missing_inventory')
            .select(`
                inventory (inventoryId, ingredientName), 
                quantity, 
                unit,
                newDate,
                userId,
                users (id, lastname)
            `)
            .order('newDate', { ascending: false })
            .eq('inventoryId', inventoryId);

        if (error) {
            throw error;
        }

        res.send(reports);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}