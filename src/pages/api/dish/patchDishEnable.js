import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(patchInventory);

async function patchInventory(req, res) {
    try {
        const dish = await req.body;
        console.log(dish);
        
        const { data, error } = await supabase
            .from('dish')
            .update({ enable: dish.enable})
            .eq('dishId', dish.dishId);

    
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}