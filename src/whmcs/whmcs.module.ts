import { forwardRef, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { WhmcsUsersController } from "./whmcs.controller";
import { WhmcsService } from "./whmcs.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [HttpModule, forwardRef(() => UsersModule)],
  controllers: [WhmcsUsersController],
  providers: [WhmcsService],
  exports: [WhmcsService],
})
// eslint-disable-next-line prettier/prettier
export class WhmcsModule { }
