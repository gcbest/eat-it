import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, InputType } from 'type-graphql';
import { User } from './User';

@ObjectType()
@InputType('CartItemInput')
@Entity('cartItems')
export class CartItem extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column('text')
    name: string;

    @Field(() => Int)
    @Column()
    amount: number;

    @Field()
    @Column('text')
    img: string;

    @Field()
    @Column('text')
    units: string;

    @Field(() => Int)
    @Column()
    aisle: number;

    @Field()
    @Column()
    isChecked: boolean;

    @ManyToOne(() => User, user => user.cartItems, { onDelete: 'CASCADE' })
    user: User
}