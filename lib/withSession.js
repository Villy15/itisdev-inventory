import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

export const sessionOptions = {
    cookieName: "userCookie",
    password: "vO^rW20cTgTenC&!H*$5FL0Z@x8j58Z&",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export function withSessionRoute(handler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
    return withIronSessionSsr(handler, sessionOptions);
}