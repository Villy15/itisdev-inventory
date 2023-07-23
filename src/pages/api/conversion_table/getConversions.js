import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getDish);

async function getDish(req, res) {
    try {
        let { data: ingredients, error } = await supabase
            .from('conversion_table')
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