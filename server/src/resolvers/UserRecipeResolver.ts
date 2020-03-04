// import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
// import { User } from "../entity/User";
// import { UserRecipe } from "../entity/UserRecipe";
// import { Recipe } from "../entity/Recipe";

// @Resolver()
// export class UserRecipeResolver {
//   @Mutation(() => Recipe)
//   async createRecipe(@Arg("name") name: string) {
//     return Recipe.create({ name }).save();
//   }

//   @Mutation(() => User)
//   async createUser(@Arg("email") email: string) {
//     return User.create({ email }).save();
//   }

//   @Mutation(() => Boolean)
//   async addUserRecipe(
//     @Arg("userId", () => Int) userId: number,
//     @Arg("recipeId", () => Int) recipeId: number
//   ) {
//     await UserRecipe.create({ userId, recipeId }).save();
//     return true;
//   }

//   @Mutation(() => Boolean)
//   async deleteBook(@Arg("recipeId", () => Int) recipeId: number) {
//     await UserRecipe.delete({ recipeId });
//     await Recipe.delete({ id: recipeId });
//     return true;
//   }

//   @Query(() => [Recipe])
//   async recipes() {
//     return Recipe.find();
//   }
// }
