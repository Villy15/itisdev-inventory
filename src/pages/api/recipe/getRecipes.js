import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getRecipes);

async function getRecipes(req, res) {
    try {
        let { data: recipes, error } = await supabase
            .from('recipe')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(recipes);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}