import "dotenv/config";
import "reflect-metadata";
import path from "path";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { RecipeResolver } from "./resolvers/RecipeResolver";
import { CartItemResolver } from "./resolvers/CartItemResolver";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import cors from "cors";
import { User } from "./entity/User";
import { sendRefreshToken } from "./sendRefreshToken";
import { createAccessToken, createRefreshToken } from "./auth";

(async () => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  app.use(
    cors({
      origin: 'https://eat--it.herokuapp.com/' || 'http://localhost:3000',
      credentials: true
    })
  );
  app.use(cookieParser());

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    // token is valid and
    // we can send back an access token
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection().catch(err => { console.error(err.message) });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, RecipeResolver, CartItemResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../web/build")));

    app.use((_, res) =>
      res.sendFile(path.join(__dirname, "../web/build/index.html"))
    );
  }

  app.listen(PORT, () => {
    console.log(`express server started on port: ${PORT}`);
  });
})();
