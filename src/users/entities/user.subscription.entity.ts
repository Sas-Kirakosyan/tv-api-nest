import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

export enum PackageType {
  TRIAL = 1,
  NORMAL = 2,
  PREMIUM = 3,
}

@Entity({ name: "user_subscription" })
export class UserSubscriptionEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.subscriptions, { onDelete: "CASCADE" })
  user: UserEntity;

  @Column({ type: "varchar", nullable: false })
  subscriptionId: string; // ID returned by TV-API

  @Column({ type: "int", nullable: false })
  package: PackageType; // Package type (e.g., trial, normal)

  @Column({ type: "varchar", nullable: false })
  tvUsername: string; // Username used for TV-API

  @Column({ type: "varchar", nullable: false })
  tvPassword: string; // Password used for TV-API

  @Column({ type: "timestamp", nullable: false })
  expireDate: Date; // Expiration date of the subscription

  @Column({ type: "boolean", default: false })
  isActive: boolean; // Whether the subscription is active

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
