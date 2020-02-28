import {
    Resolver, Query,
    // Mutation,
    //  Arg,
    //  ObjectType,
    //  Field,
    Ctx,
    // UseMiddleware,
    //  Int
} from 'type-graphql';
import { Recipe } from '../entity/Recipe';
// import { isAuth } from '../isAuth';
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
    // @UseMiddleware(isAuth)
    async randomRecipes(@Ctx() { req }: MyContext) {
        console.log(req.body)
        const { tags = 'vegetarian', number = 1 } = req.body
        let params = { tags, number }
        try {
            const results = await spoonacular.random(params)
            console.log(results);
            return results;
        } catch (err) {
            console.error(err);
            return err;
        }
    }
}