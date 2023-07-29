import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getPhysicalCountList);

async function getPhysicalCountList(req, res) {
    try {
        const { sheet_number } = req.query;

        let { data: users, error } = await supabase
            .from('physical_count_list')
            .select(`
                sheet_number,
                physical_count (updateDate, userId),
                inventory(inventoryId, ingredientName),
                unit,
                quantity
            `)
            .eq('sheet_number', sheet_number);

        if (error) {
            throw error;
        }

        res.send(users);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}