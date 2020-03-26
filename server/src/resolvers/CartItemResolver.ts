import {
    Resolver, Query,
    Arg,
    // InputType,
    // Field,
    UseMiddleware,
    Mutation,
    InputType,
    Field,
} from 'type-graphql';
// import { User } from '../entity/User';
import { CartItem } from '../entity/CartItem';
import { isAuth } from '../isAuth';
import { User } from '../entity/User';
import { getConnection } from 'typeorm';
// import { getConnection } from "typeorm";

// @InputType()
// class CartItemInput extends CartItem {

// }

@InputType()
class AddCartItem implements Partial<CartItem> {
    @Field()
    name: string;
    @Field()
    amount: number;
    @Field()
    img: string;
    @Field()
    units: string;
    @Field()
    aisle: number;
    @Field()
    isChecked: boolean;
    @Field()
    userId: number;
}

@InputType()
class EditCartItem extends AddCartItem {
    @Field()
    id: number
}

@Resolver()
export class CartItemResolver {
    @Query(() => [CartItem])
    @UseMiddleware(isAuth)
    async getCartItemsByUserId(@Arg('id') id: number): Promise<CartItem[] | undefined> {
        try {
            const user = await getConnection()
                .createQueryBuilder()
                .select("user")
                .from(User, "user")
                .where("user.id = :id", { id })
                .leftJoinAndSelect('user.cartItems', 'cartItems')
                .orderBy('cartItems.aisle', 'ASC')
                .getOne();

            if (!user)
                return

            return user.cartItems
        } catch (error) {
            console.error(error);
            return
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async addCartItem(@Arg("item") item: AddCartItem): Promise<Boolean> {
        try {
            let user = await User.findOne(item.userId)
            const newItem = { ...item, user: user! }
            await CartItem.insert(newItem)
            return true
        } catch (error) {
            console.error(error);
            return false
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async updateCartItemById(@Arg("item") item: EditCartItem): Promise<Boolean> {
        try {
            const { userId } = item
            delete item.userId
            let user = await User.findOne({ where: { id: userId } })
            const updatedItem = { ...item, user: user! }

            await getConnection()
                .createQueryBuilder()
                .update(CartItem)
                .set(updatedItem)
                .where("id = :id", { id: item.id })
                .execute();

            return true
        } catch (error) {
            console.error('error message:', error);
            return false
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async toggleCartItemCheckedById(@Arg("id") id: number, @Arg("isChecked") isChecked: boolean): Promise<Boolean> {
        try {
            await getConnection()
                .createQueryBuilder()
                .update(CartItem)
                .set({ isChecked })
                .where("id = :id", { id })
                .execute();

            return true
        } catch (error) {
            console.error('error message:', error);
            return false
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteCartItem(@Arg("id") id: number): Promise<Boolean> {
        try {
            console.log(id);

            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(CartItem)
                .where("id = :id", { id })
                .execute();

            console.log('DELETED');

            return true
        } catch (error) {
            console.error('error message:', error);
            return false
        }
    }

}