import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserSubscriptionEntity } from "./entities/user.subscription.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TvApiModule } from "../tv-api/tv-api.module";
import { AuthModule } from "../auth/auth.module";
import { WhmcsModule } from "../whmcs/whmcs.module"; // Import WhmcsModule

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity, UserSubscriptionEntity]),
    TvApiModule,
    WhmcsModule, // Add WhmcsModule to imports
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService to make it available in other modules
})
// eslint-disable-next-line prettier/prettier
export class UsersModule { }
