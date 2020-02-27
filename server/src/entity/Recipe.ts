import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
  OneToMany
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { UserRecipe } from "./UserRecipe";

@ObjectType()
@Entity("recipes")
export class Recipe extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  title: string;

  @Field(() => Int)
  @Column()
  readyInMinutes: number;

  @Field(() => Int)
  @Column()
  servings: number;

  @Field()
  @Column("text")
  image: string;

  @Field()
  @Column("text")
  summary: string;

  @Field()
  @Column("text")
  sourceUrl: string;

  @Field()
  @Column("text")
  analyzedInstructions: string;

  @OneToMany(() => UserRecipe, ur => ur.recipe)
  userConnection: Promise<UserRecipe[]>;
}
