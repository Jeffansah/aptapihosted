import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/usersModel.js";

dotenv.config();

// Verify Access Token
export const verifyToken = async (ctx, next) => {
  const token = ctx.cookies.get("access_token");
  if (!token) {
    ctx.throw(401, "Token not found");
  } else {
    try {
      const user = jwt.verify(token, process.env.JWT_KEY);
      ctx.state.user = user;
      await next();
    } catch (error) {
      ctx.throw(403, "Token not valid");
    }
  }
};

// // Verify User Session
// export const verifySession = async (ctx, next) => {
//   await verifyToken(ctx, async () => {
//     // const userId = ctx.state.user._id;
//     // const foundUser = await User.findById(userId);
//     // console.log(foundUser);

//     // if (foundUser) {
//     //   ctx.state.isAuthenticated = true;
//     //   await next();
//     // } else {
//     //   ctx.throw(401, "User not found");
//     // }
//     ctx.state.isAuthenticated = true;
//     await next();
//   });
// };

// Verify User Status
export const verifyUser = async (ctx, next) => {
  await verifyToken(ctx, async () => {
    if (ctx.state.user.id === ctx.params.id || ctx.state.user.isAdmin) {
      await next();
    } else {
      ctx.throw(403, "You are unauthorized to perform this operation");
    }
  });
};

// Verify Admin Status
export const verifyAdmin = async (ctx, next) => {
  await verifyToken(ctx, async () => {
    if (ctx.state.user.isAdmin) {
      await next();
    } else {
      ctx.throw(403, "You are unauthorized to perform this operation");
    }
  });
};
