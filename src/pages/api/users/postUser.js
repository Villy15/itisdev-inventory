import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";

export default withSessionRoute(postUser);

async function postUser(req, res) {
    try {
        const newUser = await req.body;
        console.log(newUser);

        const { data, error } = await supabase
            .from("users")
            .insert(newUser);
        
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}