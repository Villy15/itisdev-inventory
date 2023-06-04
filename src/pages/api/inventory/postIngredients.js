import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postIngredients);

async function postIngredients(req, res) {
    try {
        const ingredient = await req.body;
        console.log(ingredient);

        const { data, error } = await supabase
            .from("ingredients")
            .insert(ingredient);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}