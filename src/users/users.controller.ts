import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  BadRequestException,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserSubscriptionEntity } from "./entities/user.subscription.entity";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UserEntity } from "./entities/user.entity";
import { AuthDataTypes } from "../auth/auth.interface";
// import { Request } from "express";

@ApiTags("users")
@Controller("users")
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly usersService: UsersService) { }

  @Post("mix-register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.log("error", error);
      throw new BadRequestException(error?.message, "User registration failed.");
    }
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard) // Protect route with JWT authentication guard
  async getProfile(@Request() req: Request & { user: UserEntity }) {
    const email = req.user["email"]; // Get the user ID from the decoded JWT

    return await this.usersService.findOneByEmail(email);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }
  // Endpoint to create a subscription
  @Post("tv-api/subscriptions")
  @UseGuards(JwtAuthGuard)
  async createSubscription(
    @Req() request: Request & { user: AuthDataTypes }, // Access the request to get the authenticated user
    @Body() subscriptionData: Partial<UserSubscriptionEntity>,
  ): Promise<UserSubscriptionEntity> {
    // Extract user info from the decoded JWT
    const tvApiPassword = this.generateRandomPassword();
    const { user } = request; // Step 2: Call the TV API (reuse user email and password)
    const { sub: userId, email } = user;
    console.log("user--", { user, subscriptionData, userId });

    console.log("data", {
      line_type: "line",
      package: subscriptionData.package,
      description: "test",
      username: email, // Use user's email as username
      password: tvApiPassword, // Use user's existing password
    });

    const subscriptionBodyData = {
      line_type: "line",
      package: subscriptionData.package || 0,
      description: "test",
      username: email, // Use user's email as username
      password: tvApiPassword, // Use user's existing password
    };

    return this.usersService.createSubscription(userId, subscriptionBodyData);
  }

  private generateRandomPassword(): string {
    return [...Array(12)].map(() => Math.random().toString(36)[2]).join("");
  }

  @Get("tv-api/subscriptions")
  @UseGuards(JwtAuthGuard)
  async getUserSubscriptions(
    @Req() request: Request & { user: AuthDataTypes },
  ): Promise<UserSubscriptionEntity[] | object> {
    const { user } = request;
    const { sub: userId } = user;
    return this.usersService.getUserSubscriptions(userId);
  }

  // Optional: Endpoint to delete a subscription
  // @Delete("subscriptions/:subscriptionId")
  // async deleteSubscription(@Param("subscriptionId") subscriptionId: number): Promise<void> {
  //   return this.usersService.deleteSubscription(subscriptionId);
  // }

  @Post("tv-api/subscriptions/extend/:packageId")
  async extendSubscription(
    @Param("packageId") packageId: string,
    @Body() packageType: { package: number },
  ) {
    return this.usersService.extendSubscription(packageId, packageType);
  }

  @Delete("tv-api/subscriptions/:subscriptionId")
  async deleteSubscription(
    @Param("subscriptionId", ParseIntPipe) subscriptionId: string,
  ): Promise<void> {
    return this.usersService.deleteSubscription(subscriptionId);
  }
}
