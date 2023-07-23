import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getVariant);

async function getVariant(req, res) {
    const { inventoryId } = req.query;
    console.log(inventoryId);

    try {
        let { data: users, error } = await supabase
            .from('variation')
            .select('*')
            .eq('inventoryId', inventoryId);

        if (error) {
            throw error;
        }

        console.log(inventoryId);
        console.log(users);
        res.send(users);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}