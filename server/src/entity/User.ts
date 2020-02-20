import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
  // OneToMany 
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
// import { Recipe } from './Recipe';
// import { UserRecipe } from './UserRecipe';

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  email: string;

  @Column("text")
  password: string;

  // @Column("float")
  // exerciseLevel: number;

  @Column("text")
  diets: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  // @OneToMany(() => UserRecipe, ur => ur.user)
  // recipeConnection: Promise<Recipe[]>;
}
