import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getDishDetails);

async function getDishDetails(req, res) {
    const { dishId } = req.query;

    try {
        let { data: ingredients, error } = await supabase
            .from('dish')
            .select(`
                dishName,
                dishPhoto,
                category,
                price,
                description,
                enable
            `)
            .eq('dishId', dishId);

        if (error) {
            throw error;
        }

        console.log(ingredients);
        res.send(ingredients);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}
