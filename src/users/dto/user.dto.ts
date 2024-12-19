import { Expose } from "class-transformer";

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  phone?: string;

  @Expose()
  firstname?: string;
}
