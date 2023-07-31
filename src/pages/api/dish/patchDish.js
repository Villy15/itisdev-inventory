import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(patchInventory);

async function patchInventory(req, res) {
    try {
        const dishId = await req.body;
        console.log(dishId.dishId);
        
        const { data, error } = await supabase
            .from('dish')
            .update({ confirmed: true})
            .eq('dishId', dishId.dishId);

    
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}