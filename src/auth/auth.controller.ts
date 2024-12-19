import { Controller, Post, Body, Res, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "../users/dto/login-user.dto";

@Controller("auth")
export class AuthController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
    console.log({
      loginUserDto,
    });
    const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const jwt = await this.authService.login(user);
    response.cookie("jwt", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // enable in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { message: "Login successful" };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("jwt");
    return { message: "Logged out successfully" };
  }
}
