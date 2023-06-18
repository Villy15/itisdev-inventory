import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postExpiredInventory);

async function postExpiredInventory(req, res) {
    try {
        console.log("postExpiredInventory");
        const newSpoiled_Inventory = await req.body;
        console.log(newSpoiled_Inventory);

        const { data, error } = await supabase
            .from("spoiled_inventory")
            .insert(newSpoiled_Inventory);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}