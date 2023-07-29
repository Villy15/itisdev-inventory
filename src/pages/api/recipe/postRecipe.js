import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postRecipe);

async function postRecipe(req, res) {
    try {
        const newRecipe = await req.body;

        const { data, error } = await supabase
            .from("recipe")
            .insert(newRecipe);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}