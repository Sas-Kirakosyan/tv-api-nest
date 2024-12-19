import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
import { IsEmail, IsInt, IsString } from "class-validator";
import { UserSubscriptionEntity } from "./user.subscription.entity";

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  @IsInt()
  public id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: "varchar", nullable: true })
  public phone?: string;

  @Column({ type: "varchar", nullable: true })
  @IsString()
  public firstname?: string;

  @OneToMany(() => UserSubscriptionEntity, (subscription) => subscription.user, { cascade: true })
  subscriptions: UserSubscriptionEntity[];
}
