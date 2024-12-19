import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { WhmcsCreateClientResponse } from "./whmcs-responce.interface";

@Injectable()
export class WhmcsService {
  private apiUrl = "https://novatvip.com/whmcs/whmcs/includes/api.php";
  private apiIdentifier = "p47xxgiklUL9qz7J65jrOexKmOQo1CuM";
  private apiSecret = "ybR5Dm05xrep3y6Gwkwl9JU1pRbNhCDQ"; // Ensure this is hashed

  // eslint-disable-next-line prettier/prettier
  constructor(private readonly httpService: HttpService) { }

  async createClient(clientData: CreateUserDto) {
    // const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    //TODO clientIp does not shows in admin when create user, but in the future it need to use for login or analitics
    const postData = {
      action: "AddClient",
      identifier: this.apiIdentifier,
      secret: this.apiSecret, // Use API secret as is, no hashing required
      email: clientData.email,
      firstname: clientData.firstname || "default firstName",
      lastname: clientData.lastname || "default lastName",
      password2: clientData.password,
      phonenumber: clientData.phone || "00000",
      responsetype: "json",
      address1: clientData.address1 || "default address",
      city: clientData.city || "default city",
      state: clientData.state || "default state",
      postcode: clientData.postcode || "default postcode",
      country: clientData.country || "default country",
    };

    try {
      // Send data to WHMCS API
      const response = await firstValueFrom(
        this.httpService.post<WhmcsCreateClientResponse>(
          this.apiUrl,
          new URLSearchParams(postData).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      console.log("err", error);
      console.error("Error while creating client:", error);
      throw new Error("Failed to create client in WHMCS");
    }
  }

  // this request return url for the user profile
  async loginProfileToWhmcs(email: string) {
    try {
      const clientDetails = await this.getClientDetails(email);
      const { userid } = clientDetails || {};

      if (userid) {
        const ssoTokenResponse = await this.createSsoToken(userid);
        if (ssoTokenResponse.redirectUrl) {
          return { redirectUrl: ssoTokenResponse.redirectUrl };
        } else {
          return { error: "Failed to generate SSO token" };
        }
      } else {
        throw new Error("User ID not found in client details");
      }
    } catch (error) {
      console.log("err", error, error.message);
      return { error: error.message };
    }
  }

  private async getClientDetails(email: string) {
    const postData = {
      action: "GetClientsDetails",
      email: email,
      identifier: this.apiIdentifier,
      secret: this.apiSecret,
      responsetype: "json",
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, new URLSearchParams(postData).toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
      );

      if (response.data.result === "success") {
        return response.data;
      } else {
        throw new Error(`Failed to get client details: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error while fetching client details:", error);
      throw new Error("Failed to get client details in WHMCS");
    }
  }

  private async createSsoToken(clientId: number) {
    const postData = {
      action: "CreateSsoToken",
      client_id: clientId.toString(),
      identifier: this.apiIdentifier,
      secret: this.apiSecret,
      responsetype: "json",
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, new URLSearchParams(postData).toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
      );

      return {
        redirectUrl: response.data.redirect_url,
      };
    } catch (error) {
      console.error("Error while generating SSO token:", error);
      throw new Error("Failed to generate SSO token in WHMCS");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // The cost factor for hashing, more rounds = more secure but slower
    return await bcrypt.hash(password, saltRounds);
  }
}
