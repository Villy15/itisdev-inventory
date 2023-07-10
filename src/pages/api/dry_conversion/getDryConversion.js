import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getDryConversion);

async function getDryConversion(req, res) {
    try {
        let { data: dry_conversion, error } = await supabase
            .from('dry_conversion')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(dry_conversion);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}