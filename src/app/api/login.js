import { supabase } from '../../supabase';

export default async function login(req, res) {
  const { username, password } = req.body;

  console.log(username, password);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }


  // try {
  //   // Perform the login authentication using Supabase
  //   const { user, error } = await supabase.auth.signIn({
  //     email: username, // Assuming the email field is used as the username
  //     password,
  //   });

  //   if (error) {
  //     return res.status(401).json({ error: error.message });
  //   }

  //   return res.status(200).json({ user });
  // } catch (error) {
  //   console.error('Login error:', error);
  //   return res.status(500).json({ error: 'Internal server error' });
  // }
}