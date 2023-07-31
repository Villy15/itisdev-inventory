import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";
import bcrypt from "bcrypt";

export default withSessionRoute(postUser);

async function postUser(req, res) {
    try {
        const newUser = await req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

        newUser.password = hashedPassword;

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