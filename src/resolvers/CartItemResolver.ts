import {
    Resolver, Query,
    Arg,
    UseMiddleware,
    Mutation,
    InputType,
    Field,
    Float,
    Int,
} from 'type-graphql';
import { CartItem } from '../entity/CartItem';
import { isAuth } from '../isAuth';
import { User } from '../entity/User';
import { getConnection } from 'typeorm';

@InputType()
class AddCartItem implements Partial<CartItem> {
    @Field()
    name: string;
    @Field(() => Float)
    amount: number;
    @Field()
    img: string;
    @Field()
    unit: string;
    @Field(() => Int)
    aisle: number;
    @Field()
    isChecked: boolean;
    @Field()
    isCleared: boolean;
    @Field(() => Int)
    userId: number;
}

@InputType()
class EditCartItem extends AddCartItem {
    @Field()
    id: number
    @Field()
    isCleared: boolean    
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
                .leftJoinAndSelect('user.cartItems', 'cartItems')
                .where("user.id = :id", { id })
                // .andWhere('cartItems.isCleared = :isCleared', {isCleared: false}) // keeping the cleared items for suggestions
                .orderBy('cartItems.aisle', 'ASC')
                .addOrderBy('cartItems.name', 'ASC')
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
    async addManyCartItems(@Arg("items", () => [AddCartItem]) items: [AddCartItem]): Promise<Boolean> {
        try {
            const user = await User.findOne(items[0].userId)
            const itemsUserAdded = items.map(item => {
                delete item.userId
                return {...item, user}
            })
            
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(CartItem)
                .values(itemsUserAdded)
                .execute();

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
    async clearItemFromShoppingList(@Arg("id") id: number, @Arg("isCleared") isCleared: boolean): Promise<Boolean> {
        try {
            await getConnection()
                .createQueryBuilder()
                .update(CartItem)
                .set({ isCleared })
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
    async clearMultipleItemsFromShoppingList(@Arg("ids", () => [Number]) ids: number[], @Arg("isCleared") isCleared: boolean): Promise<Boolean> {
        try {
            await getConnection()
                .createQueryBuilder()
                .update(CartItem)
                .set({ isCleared })
                .where("id IN (:...ids)", { ids: [...ids]})
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
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(CartItem)
                .where("id = :id", { id })
                .execute();

            return true
        } catch (error) {
            console.error('error message:', error);
            return false
        }
    }

}