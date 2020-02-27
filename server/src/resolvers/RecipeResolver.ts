import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from 'type-graphql';
import { Recipe } from '../entity/Recipe';
import { isAuth } from '../isAuth';
import { MyContext } from "../MyContext";
import { spoonacular } from '../util/util'

// @ObjectType()
// class RecipeClass {
//     @Field(() => Recipe)
//     recipe: Recipe;
// }

@Resolver()
export class RecipeResolver {
    @Query(() => [Recipe])
    @UseMiddleware(isAuth)
    async randomRecipes(@Ctx() { req }: MyContext) {
        console.log(req.body);
        const { tags, number } = req.body
        const params = { tags, number }
        try {
            return await spoonacular.random(params)
        } catch (err) {
            console.error(err);
            return err;
        }

    }


}