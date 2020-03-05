import {
    Resolver, Query,
    // Mutation,
    Arg,
    // ObjectType,
    InputType,
    // Length,
    Field,
    // Ctx,
    UseMiddleware,
    Mutation,
    //  Int
} from 'type-graphql';
import { Recipe } from '../entity/Recipe';
import { User } from '../entity/User';
import { isAuth } from '../isAuth';
// import { MyContext } from "../MyContext";
import { spoonacular } from '../util/util'

@InputType()
class AddRecipeInput implements Partial<Recipe> {
    @Field()
    title: string
    @Field()
    readyInMinutes: number
    @Field()
    servings: number
    @Field()
    image: string
    @Field()
    summary: string
    @Field()
    sourceUrl: string
    @Field()
    analyzedInstructions: string
    @Field()
    mealType: number
    @Field()
    userId: number
}

@Resolver()
export class RecipeResolver {
    @Query(() => [Recipe])
    @UseMiddleware(isAuth)
    async randomRecipes(
        @Arg("tags") tags: string,
        @Arg("number") number: number
    ) {
        let params = { tags, number }
        try {
            const results = await spoonacular.random(params)
            console.log(results);
            // convert analyzedInstructions into string
            const formattedResults = results.map((r: Recipe) => {
                r.analyzedInstructions = JSON.stringify(r.analyzedInstructions[0])
                return r
            })
            return formattedResults;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    @Mutation(() => Boolean, { nullable: true })
    @UseMiddleware(isAuth)
    async addRecipe(@Arg("input") input: AddRecipeInput): Promise<Boolean | null> {
        // sample implementation
        // const recipe = Recipe.create(input, ctx.req.body.user);
        try {
            const user = await User.findOne({ id: input.userId })
            const newRecipe = { ...input, user: user! }
            const recipe = await Recipe.insert(newRecipe)

            console.log(recipe);
            return true;
        } catch (error) {
            console.error(error);
            return null
        }


    }
}





/*

@Mutation(() => Boolean)
async createRecipe(
        // @Arg("recipe", () => RecipeClass) recipe: RecipeClass
        @Arg("data", () => RecipeClass)
{
    // email,
    // firstName,
    // lastName,
    title
}: Recipe
    ) {
    try {
        let x = {
            title
            // email,
            // firstName,
            // lastName,
        }
        await Recipe.create(x).save()
    } catch (error) {
        console.error(error);
        return false
    }
    return true
}
}
*/