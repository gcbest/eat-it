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
// import { Tag } from "../util/interfaces";

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

  @Field()
  @Column("float")
  exerciseLevel: number;

  @Field()
  @Column("text")
  diets: string;

  // @Field()
  // @Column("text")
  // tags: string; // all tags user has used on recipes

  // @Field()
  // @Column({
  //     type: 'jsonb',
  //     array: true,
  //     default: () => [],
  //     nullable: true,
  // })
  @Column({type: 'jsonb'})
  tags: Array<{id: number, name: string}>
  // tags: Tag[]
  // // @Column("simple-json")
  // // tags: {id: number, name: string}


  @Column("int", { default: 0 })
  tokenVersion: number;

  @OneToMany(() => Recipe, recipe => recipe.user, { cascade: true })
  @Field(() => [Recipe])
  recipes: Recipe[]
}
