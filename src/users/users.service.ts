import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserSubscriptionEntity } from "./entities/user.subscription.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { plainToInstance } from "class-transformer";
import { UserSubscriptionDTO } from "./dto/user-subscription.dto";
import { UserDTO } from "./dto/user.dto";
import { TvApiService } from "../tv-api/tv-api.service";
import { CreateLineData } from "../tv-api/tv-api.interface";
import { WhmcsService } from "../whmcs/whmcs.service";
import { WhmcsCreateClientSuccessResponse } from "../whmcs/whmcs-responce.interface";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(UserSubscriptionEntity)
    private readonly subscriptionRepository: Repository<UserSubscriptionEntity>,
    // eslint-disable-next-line prettier/prettier
    private readonly tvApiService: TvApiService,
    // eslint-disable-next-line prettier/prettier
    private readonly whmcsService: WhmcsService
    // eslint-disable-next-line prettier/prettier
  ) { }

  private async createUserInPostgres(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, firstname } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("create");
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstname,
    });
    return this.userRepository.save(user);
  }
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    let savedUser: UserEntity;
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      console.log("existingUser", existingUser);
      if (existingUser) {
        throw new ConflictException("Email already in use");
      }
      // Step 1: Create the user in PostgreSQL
      savedUser = await this.createUserInPostgres(createUserDto);
      console.log({ savedUser });
    } catch (error) {
      throw new InternalServerErrorException(error || "Error while saving user to the database.{}");
    }

    // Step 2: Create the user in WHMCS
    try {
      const whmcsResponse = await this.whmcsService.createClient(createUserDto);
      console.log("whmcsResponse", whmcsResponse);
      // Check if WHMCS creation is successful
      if ((whmcsResponse as WhmcsCreateClientSuccessResponse)?.result !== "success") {
        throw new InternalServerErrorException("Failed to create user in WHMCS");
      }

      // Optionally, you can store WHMCS user details (e.g., clientId) in your database for future reference
      // e.g., savedUser.whmcsClientId = whmcsResponse.clientid;
      // await this.userRepository.save(savedUser);
    } catch (error) {
      console.log("error----", error);
      // Handle failure of WHMCS user creation and clean up if needed (rollback or logging)
      await this.userRepository.delete(savedUser.id); // Optionally remove the user from the database if WHMCS fails
      throw new InternalServerErrorException("Failed to create user in WHMCS");
    }

    return savedUser;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: any): Promise<UserEntity> {
    console.log({ id });
    if (!id) {
      throw new NotFoundException(`User with ID not provided`);
    }
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: any): Promise<UserEntity> {
    console.log({ email });
    if (!email) {
      throw new NotFoundException(`User with Email not provided`);
    }
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with ID ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Create a new subscription for a user
  async createSubscription(
    userId: number,
    subscriptionBodyData: CreateLineData,
  ): Promise<UserSubscriptionEntity> {
    const tvApiResponse = await this.tvApiService.createLine(subscriptionBodyData);
    console.log("tvApiResponse", tvApiResponse);

    const subscriptionDetails: Partial<UserSubscriptionEntity> = {
      subscriptionId: tvApiResponse.id.toString(), // Response from TV API
      package: subscriptionBodyData.package,
      tvUsername: subscriptionBodyData.username, // Username used in the TV API
      tvPassword: subscriptionBodyData.password, // Password used in the TV API
      expireDate: new Date(tvApiResponse?.expire_date * 1000), // Response from TV API
      isActive: true,
    };
    console.log("subscriptionDetails", subscriptionDetails);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    const subscription = this.subscriptionRepository.create({
      ...subscriptionDetails,
      user,
    });

    return this.subscriptionRepository.save(subscription);
  }

  // Get all subscriptions for a specific user
  async getUserSubscriptions(userId: number): Promise<UserSubscriptionDTO[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: { user: { id: userId } },
      relations: ["user"], // Fetch user data
    });

    // Transform the result into UserSubscriptionDTO
    return subscriptions.map((subscription) => {
      const userDto = plainToInstance(UserDTO, subscription.user, {
        excludeExtraneousValues: true,
      });
      const subscriptionDto = plainToInstance(UserSubscriptionDTO, subscription, {
        excludeExtraneousValues: true,
      });

      subscriptionDto.user = userDto; // Replace `user` with the transformed DTO
      return subscriptionDto;
    });
  }

  async extendSubscription(subscriptionId: string, packageType: { package: number }): Promise<any> {
    const result = await this.tvApiService.extend(subscriptionId, packageType);

    console.log("extend ", result);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
    }
    return result;
  }

  // Optional: Delete a subscription
  async deleteSubscription(subscriptionId: string): Promise<any> {
    console.log("subscriptionId", subscriptionId);

    // Step 1: Call TvApiService to delete subscription in external API
    await this.tvApiService.delete(subscriptionId);

    // Step 2: Delete subscription from the internal database
    const result = await this.subscriptionRepository.delete({ subscriptionId });
    console.log("delete ", result);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
    }
    console.log(`Subscription ${subscriptionId} deleted successfully.`);
    return result;
  }
}
