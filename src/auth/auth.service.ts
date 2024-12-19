import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = user;
      return userData;
    }
    throw new UnauthorizedException("Invalid credentials");
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: "1d" }); // 1-day expiration
  }
}
