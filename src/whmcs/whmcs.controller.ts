import { Controller, Post, Body } from "@nestjs/common";
import { WhmcsService } from "./whmcs.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";

@Controller("whmcs/api/users")
export class WhmcsUsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly whmcsService: WhmcsService) { }

  @Post("register")
  async registerUser(@Body() userData: CreateUserDto) {
    const clientData = {
      email: userData.email,
      firstname: userData.firstname,
      phone: userData.phone,
      lastname: userData.lastname,
      password: userData.password,
      address1: userData.address1,
      city: userData.city,
      state: userData.state,
      postcode: userData.postcode,
      country: userData.country,
      phoneNumber: userData.phone,
    };
    const response = await this.whmcsService.createClient(clientData);
    return response;
  }

  @Post("login/profile")
  async loginUser(@Body() userData: LoginUserDto) {
    const response = await this.whmcsService.loginProfileToWhmcs(userData.email);
    return response;
  }
}
