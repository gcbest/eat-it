import {
  BaseEntity,
  Entity,
  JoinColumn,
  // ManyToOne,
  PrimaryColumn
} from "typeorm";
// import { User } from "./User";
import { Recipe } from "./Recipe";

@Entity()
export class UserRecipe extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  recipeId: number;

  // @ManyToOne(() => User, user => user.recipeConnection, { primary: true })
  // @JoinColumn({ name: "userId" })
  // user: Promise<User>;

  // @ManyToOne(() => Recipe, recipe => recipe.userConnection, {
  //   primary: true
  // })
  @JoinColumn({ name: "recipeId" })
  recipe: Promise<Recipe>;
}