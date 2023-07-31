import { withSessionRoute } from "../../../lib/withSession";
import supabase from "../../../supabase";
import bcrypt from "bcrypt";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
  const { username, password } = await req.body;

  let { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  console.log(users);
  const user = users[0];

  if (error) {
    throw error;
  }

  if (!user) {
    res.statusCode = 404;
    res.send({ error: "User not found" });
    return;
  } 

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.statusCode = 401;
    res.send({ error: "Incorrect password" });
    return;
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    firstname: user.firstname,
    lastname: user.lastname,
  };


  await req.session.save();
  res.send({ ok: true });
}