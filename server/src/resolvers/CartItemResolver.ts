import {
    Resolver, Query,
    Arg,
    // InputType,
    // Field,
    UseMiddleware,
    // Mutation,
} from 'type-graphql';
// import { User } from '../entity/User';
import { CartItem } from '../entity/CartItem';
import { isAuth } from '../isAuth';
import { User } from '../entity/User';
// import { getConnection } from "typeorm";

// @InputType()
// class CartItemInput extends CartItem {

// }

@Resolver()
export class CartItemResolver {
    @Query(() => [CartItem])
    // @Query(() => User)
    @UseMiddleware(isAuth)
    async getCartItemsByUserId(@Arg('id') id: number): Promise<CartItem[] | undefined> {
    // async getCartItemsByUserId(@Arg('id') id: number): Promise<User | undefined> {
        try {
            const user = await User.findOne({ where: { id }, relations: ['cartItems'] })
            // const user = await User.findOne({ id })
            if(!user)
                return

            console.log(user);
            return user.cartItems
            // return user
        } catch (error) {
            console.error(error);
            return
        }
    }

    // @Mutation()
    // @UseMiddleware(isAuth)
    // async addCartItem(@Arg("input") input: CartItem): Promise<Boolean> {
    //     try {
    //         await CartItem.insert(input)
    //         return true
    //     } catch (error) {
    //         console.error(error);
    //         return false
    //     }
    // }

}