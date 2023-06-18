import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postIncreaseInventory);

async function postIncreaseInventory(req, res) {
    try {
        const newIncrease_Inventory = await req.body;
        console.log(newIncrease_Inventory);

        const { data, error } = await supabase
            .from("increase_inventory")
            .insert(newIncrease_Inventory);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}