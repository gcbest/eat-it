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
import { User, TagInput } from '../entity/User';
import { isAuth } from '../isAuth';
// import { MyContext } from "../MyContext";
import { spoonacular } from '../util/util'
import { getConnection } from "typeorm";


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
    @Field(() => [TagInput])
    tags: TagInput[]
    @Field()
    userId: number
}

@InputType()
class EditRecipeInput implements Partial<Recipe> { //TODO: check if can implement AddRecipeInput
    @Field()
    id: number
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
    @Field(() => [TagInput])
    tags: TagInput[]
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
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    @Query(() => Recipe)
    @UseMiddleware(isAuth)
    async getRecipeById(@Arg('id') id: number) {
        try {
            const recipe = await Recipe.findOne({ id })
            console.log(recipe);
            return recipe
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    @Mutation(() => User, { nullable: true })
    @UseMiddleware(isAuth)
    async addRecipe(@Arg("input") input: AddRecipeInput): Promise<User | undefined> {
        // sample implementation
        // const recipe = Recipe.create(input, ctx.req.body.user);
        try {
            let user = await User.findOne({ where: { id: input.userId } })
            const newRecipe = { ...input, user: user! }
            await Recipe.insert(newRecipe)
            user = await User.findOne({ where: { id: input.userId }, relations: ["recipes"] })

            console.log(user);
            return user;
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async updateRecipeById(@Arg("input") input: EditRecipeInput): Promise<User | undefined> {
        try {
            const {userId} = input
            delete input.userId
            let user = await User.findOne({ where: { id: userId }})
            const updatedRecipe = { ...input, user: user! }

            // let recipeToUpdate = Recipe.findOne({where: {id: }})
            await getConnection()
                .createQueryBuilder()
                .update(Recipe)
                .set(updatedRecipe)
                .where("id = :id", { id: input.id })
                .execute();

            const updatedUser = await User.findOne({ where: { id: userId }, relations: ["recipes"] })
            return updatedUser
        } catch (error) {
            console.error('error message:', error);
            return undefined
        }
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async deleteRecipeById(@Arg('recipeId') recipeId: number, @Arg('userId') userId: number): Promise<User | Boolean> {
        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Recipe)
                .where("id = :id", { id: recipeId })
                .execute();
            const user = await User.findOne({ where: { id: userId }, relations: ["recipes"] })
            console.log(user);

            if (user)
                return user
            else
                return false
        } catch (error) {
            console.error(error);
            return false
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