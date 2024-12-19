import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password" })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: "John" })
  firstname: string;

  @ApiProperty({ example: "Doe" })
  lastname: string;

  @ApiProperty({ example: "+37411111111" })
  phone: string;

  @ApiProperty({ example: "123 Main St" })
  address1: string;

  @ApiProperty({ example: "Yerevan" })
  city: string;

  @ApiProperty({ example: "Yerevan" })
  state: string;

  @ApiProperty({ example: "0010" })
  postcode: string;

  @ApiProperty({ example: "Armenia" })
  country: string;
}
