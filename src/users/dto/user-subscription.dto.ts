import { UserDTO } from "./user.dto";
import { Expose, Type } from "class-transformer";

export class UserSubscriptionDTO {
  @Expose()
  id: number;

  @Expose()
  subscriptionId: string;

  @Expose()
  package: number;

  @Expose()
  tvUsername: string;

  @Expose()
  tvPassword: string;

  @Expose()
  expireDate: Date;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserDTO)
  user: UserDTO; // Transform user to a UserDTO
}
