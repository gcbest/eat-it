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
import { User, TagInput } from "./User";


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

  @Field()
  extendedIngredients: string;

  @Field()
  @Column()
  isStarred: boolean;

  @Field(()=> [String])
  dishTypes: string[];

  @Field(()=>[TagInput])
  @Column({type: 'jsonb', nullable: true})
  tags: TagInput[]

  @Field(() => Int)
  @Column()
  mealType: number;

  @ManyToOne(() => User, user => user.recipes, { onDelete: 'CASCADE' })
  user: User
}
