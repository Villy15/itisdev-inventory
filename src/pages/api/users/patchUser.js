import { withSessionRoute } from "@lib/withSession";
import supabase from "@supabase";
import bcrypt from "bcrypt";

export default withSessionRoute(patchInventory);

async function patchInventory(req, res) {
    try {
        const newUser = await req.body;
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

        newUser.password = hashedPassword;

        const { data, error } = await supabase
            .from('users')
            .update({ password: newUser.password })
            .eq('id', newUser.userId);

    
        if (error) {
            throw error;
        }
        
        res.send({ ok: true });
    } catch (error) {
        res.statusCode = 500;
        res.send({ error: "Server error" });
    }
}