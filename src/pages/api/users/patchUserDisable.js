import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(patchInventory);

async function patchInventory(req, res) {
    try {
        const newUser = await req.body;
        
        const { data, error } = await supabase
            .from('users')
            .update({ enable: false })
            .eq('id', newUser.id);

    
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}