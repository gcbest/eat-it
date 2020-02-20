import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
  // OneToMany
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
// import { UserRecipe } from "./UserRecipe";

@ObjectType()
@Entity("recipes")
export class Recipe extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  name: string;

  @Field()
  @Column("text")
  url: string;

  @Field()
  @Column("text")
  image_url: string;

  // @OneToMany(() => UserRecipe, ur => ur.recipe)
  // userConnection: Promise<UserRecipe[]>;
}
