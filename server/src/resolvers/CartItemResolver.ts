import {
    Resolver, Query,
    Arg,
    InputType,
    Field,
    UseMiddleware,
    Mutation,
} from 'type-graphql';
import { User } from '../entity/User';
import { CartItem } from '../entity/CartItem';
import { isAuth } from '../isAuth';
import { getConnection } from "typeorm";



@Resolver()
export class CartItemResolver {
    @Query(() => [CartItem])
    @UseMiddleware(isAuth)
    async getCartItems(@Arg('id') id: number) {
        
    }
}