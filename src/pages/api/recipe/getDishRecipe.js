import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getDishRecipe);

async function getDishRecipe(req, res) {
    const { dishId } = req.query;

    try {
        let { data: recipes, error } = await supabase
            .from('recipe')
            .select(`
                inventory (inventoryId, ingredientName), 
                quantity,
                unit
            `)
            .eq('dishId', dishId)
            ;

        if (error) {
            throw error;
            
        }

        res.send(recipes);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}