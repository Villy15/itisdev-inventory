import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getIngredients);

async function getIngredients(req, res) {
    try {
        let { data: ingredients, error } = await supabase
            .from('ingredients')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(ingredients);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}