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
import { isAuth } from '../isAuth';
// import { MyContext } from "../MyContext";
import { spoonacular } from '../util/util'

@InputType()
class AddRecipeInput implements Partial<Recipe> {
    @Field()
    title: string;
    @Field()
    readyInMinutes: number;
    @Field()
    servings: number;
    @Field()
    image: string;
    @Field()
    summary: string;
    @Field()
    sourceUrl: string;
    @Field()
    analyzedInstructions: string;
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

    @Mutation(() => Boolean)
    async addRecipe(@Arg("data") newRecipeData: AddRecipeInput): Promise<Boolean> {
        // sample implementation
        // const recipe = Recipe.create(newRecipeData, ctx.req.body.user);
        const recipe = await Recipe.insert(newRecipeData)

        console.log(recipe);
        return true;

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