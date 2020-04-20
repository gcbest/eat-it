import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import { MyContext } from "../MyContext";
import { createRefreshToken, createAccessToken } from "../auth";
import { isAuth } from "../isAuth";
import { sendRefreshToken } from "../sendRefreshToken";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import {TagInput} from '../entity/User'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await User.findOne(payload.userId, { relations: ["recipes"] });
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");

    return true;
  }

  

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email }, relations: ["recipes"] });

    if (!user) {
      throw new Error("could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("bad password");
    }

    // login successful

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("exerciseLevel") exerciseLevel: number,
    @Arg("diets") diets: string,
    @Arg("tags", ()=>[TagInput]) tags: [TagInput],
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword,
        exerciseLevel,
        diets,
        tags
      });
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  }
}
