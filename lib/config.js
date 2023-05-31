export const ironOptions = {
    cookieName: "logincookie",
    password: "vO^rW20cTgTenC&!H*$5FL0Z@x8j58Z&",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  };