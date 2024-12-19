import { Controller, Post, Body, Param, HttpException, HttpStatus } from "@nestjs/common";
import { TvApiService } from "./tv-api.service";
import { CreateLineData } from "./tv-api.interface";

@Controller("tv-api")
export class TvApiController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly tvApiService: TvApiService) { }

  @Post("create-line/1") // for trial create-line
  async createLine(@Body() data: CreateLineData) {
    try {
      const response = await this.tvApiService.createLine(data);
      return response;
    } catch (error) {
      console.log("error-create", error);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("extend/:id")
  async extend(@Param("id") id: string, @Body("packageType") packageType) {
    console.log({ id, packageType });
    try {
      const response = await this.tvApiService.extend(id, packageType);
      return response;
    } catch (error) {
      console.log("error-extend", error);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("enable/:id")
  async enable(@Param("id") id: string, @Body("enable") enable: number) {
    console.log({ id, enable });
    try {
      const response = await this.tvApiService.enable(id, enable);
      return response;
    } catch (error) {
      console.log("error-enable", error);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("delete/:id")
  async delete(@Param("id") id: string) {
    try {
      const response = await this.tvApiService.delete(id);
      return response;
    } catch (error) {
      console.log("error-delete", error);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
