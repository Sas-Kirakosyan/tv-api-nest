import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { TvApiService } from "./tv-api.service";
import { TvApiController } from "./tv-api.controller";

@Module({
  imports: [HttpModule],
  providers: [TvApiService],
  exports: [TvApiService],
  controllers: [TvApiController],
})
// eslint-disable-next-line prettier/prettier
export class TvApiModule { }
