import { withIronSession } from 'next-iron-session';

const sessionOptions = {
  password: 'SUPER_SECRET_PASSWORD',
  cookieName: 'next.js/session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

function withSession(handler) {
  return withIronSession(handler, sessionOptions);
}

export default withSession;