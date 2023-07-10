import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(getWetConversion);

async function getWetConversion(req, res) {
    try {
        let { data: wet_conversion, error } = await supabase
            .from('wet_conversion')
            .select('*');

        if (error) {
            throw error;
        }

        res.send(wet_conversion);
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}