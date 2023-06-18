import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postInventory);

async function postInventory(req, res) {
    try {
        const newInventory = await req.body;
        console.log(newInventory);

        const { data, error } = await supabase
            .from("inventory")
            .insert(newInventory);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}