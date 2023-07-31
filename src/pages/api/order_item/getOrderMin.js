import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getOrder_Items);

async function getOrder_Items(req, res) {
    try {
        // Use COUNT and GROUP BY to count the occurrences of each dishId
        let { data: items, error } = await supabase
            .from('count_dish')
            .select('*'); // Replace 5 with the minimum count you want

        if (error) {
            throw error;
        }

        res.send(items);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}