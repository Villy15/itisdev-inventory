import withSession from '../_middleware';

export default withSession(async (req, res) => {
  const user = req.session.get('user');

  if (!user) {
    return res.redirect('/login');
  }

  // Perform actions for authenticated user
  return res.status(200).json({ user });
});