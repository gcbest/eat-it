import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
  ManyToOne
} from "typeorm";
import {
  ObjectType,
  Field,
  Int,
  InputType
} from "type-graphql";
import { User } from "./User";


@ObjectType()
@InputType('RecipeInput')
@Entity("recipes")
export class Recipe extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  title: string;

  @Field(() => Int, { nullable: true })
  @Column()
  readyInMinutes: number;

  @Field(() => Int, { nullable: true })
  @Column()
  servings: number;

  @Field()
  @Column("text", { nullable: true })
  image: string;

  @Field()
  @Column("text")
  summary: string;

  @Field()
  @Column("text", { nullable: true })
  sourceUrl: string;

  @Field()
  @Column("text", { nullable: true })
  analyzedInstructions: string;

  @Field(() => Int)
  @Column()
  mealType: number;

  @ManyToOne(() => User, user => user.recipes, { onDelete: 'CASCADE' })
  user: User
}
