import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postExpired);

async function postExpired(req, res) {
    try {
        const expiredIngredient = await req.body;
        console.log(expiredIngredient);

        const { data, error } = await supabase
            .from("expired")
            .insert(expiredIngredient)
    
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}