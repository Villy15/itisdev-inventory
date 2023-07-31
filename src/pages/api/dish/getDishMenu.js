import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getDish);

async function getDish(req, res) {
    try {
        let { data: ingredients, error } = await supabase
            .from('dish')
            .select('*')
            // .eq('enable', true)
            .eq('confirmed', true)
            .order('dishName', true);

        if (error) {
            throw error;
        }
        res.send(ingredients);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}