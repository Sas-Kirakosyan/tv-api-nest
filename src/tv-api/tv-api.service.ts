import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { CreateLineData, CreateLineSuccessResponse } from "./tv-api.interface";

// TODO -> from .ENV file
const API_BASE_URL = "https://mycms.ai/api/wclient/v1/";
const API_ADMIN_USERNAME = "margar";
const API_ADMIN_PASSWORD = "sS8RyV5bc";
const API_ADMIN_TOKEN = "Bearer 668c392cae6a6668c392cae6a7668c392cae6a8668c392cae6a9";

@Injectable()
export class TvApiService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly httpService: HttpService) { }

  private async genRequest(url: string, post: object = {}): Promise<any> {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: API_ADMIN_TOKEN,
        username: API_ADMIN_USERNAME,
        password: API_ADMIN_PASSWORD,
      };

      const response =
        Object.keys(post).length > 0
          ? await firstValueFrom(this.httpService.post(url, post, { headers }))
          : await firstValueFrom(this.httpService.post(url, {}, { headers }));
      return response?.data;
    } catch (error) {
      console.log("err", error, error.response?.data?.message.username);
      const errorMessage = error.response?.data?.message;
      if (
        errorMessage &&
        errorMessage.username &&
        errorMessage.username.includes("The username has already been taken.")
      ) {
        throw new HttpException("Username is already taken", HttpStatus.CONFLICT);
      } else if (errorMessage) {
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException("Error making request", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async createLine(data: CreateLineData): Promise<CreateLineSuccessResponse> {
    const url = API_BASE_URL + "create-line";
    return this.genRequest(url, data);
  }

  async extend(packageId: string, packageType: { package: number }): Promise<any> {
    const url = API_BASE_URL + `extend/${packageId}`;
    console.log({ url, packageType });

    return this.genRequest(url, packageType);
  }

  async enable(id: string, enable: number): Promise<any> {
    const url = API_BASE_URL + `enable/${id}`;
    const data = { enable };
    console.log("enable", this.genRequest(url, data));
    return this.genRequest(url, data);
  }

  async delete(id: string): Promise<any> {
    console.log({ id });
    const url = API_BASE_URL + `delete/${id}`;
    try {
      const response = await this.genRequest(url, {});

      console.log("tvApiDelete:", response);

      // Step 2: Delete the subscription from the database
      // await this.usersService.deleteSubscription(parseInt(id));
      console.log(`Subscription with ID ${id} deleted successfully.`);
    } catch (error) {
      console.log("Error during delete operation:", error.response?.data?.message);
      const errorMessage =
        error.response?.data?.message || "Unknown error occurred during deletion";
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
