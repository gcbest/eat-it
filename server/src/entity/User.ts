import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
  OneToMany
} from "typeorm";
import {
  ObjectType,
  Field,
  Int,
  InputType,
} from "type-graphql";
import { Recipe } from './Recipe';

@ObjectType('user')
@InputType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @Column("float")
  exerciseLevel: number;

  @Column("text")
  diets: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @OneToMany(() => Recipe, recipe => recipe.user, { cascade: true })
  recipes: Recipe[]
}
