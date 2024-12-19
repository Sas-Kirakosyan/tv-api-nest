import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class PaymentService {
  private apiUrl = "https://smrtconsulting.app/api/";

  // eslint-disable-next-line prettier/prettier
  constructor(private readonly httpService: HttpService) { }

  async createPaymentLink(price: number, currency: string, productInfo: any) {
    const postData = {
      b: "1", // Your business index
      t: productInfo?.title,
      d: productInfo?.description,
      u: productInfo?.imageUrl,
      a: price,
      c: currency || "usd",
      s: "https://yourdomain.com/success-url", // Your success redirect URL
      e: "https://yourdomain.com/failure-url", // Your failure redirect URL
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}create-payment-url`, postData, {
          headers: { "Content-Type": "application/json" },
        }),
      );

      const { url } = response.data || {};

      const ulrInstance = new URL(url);
      const iv = ulrInstance.searchParams.get("iv");
      //here iv should keep in the database or whmcs
      return response.data.url; // This URL will be the payment link
    } catch (error) {
      console.error("Error creating payment link:", error);
      throw new Error("Failed to create payment link");
    }
  }

  async getTransactionStatus(iv: string) {
    const apiUrl = `${this.apiUrl}fetch-transaction?iv=${iv}`;

    try {
      const response = await firstValueFrom(this.httpService.get(apiUrl));
      return response.data; // Expected to contain "status" field
    } catch (error) {
      console.error("Error fetching transaction status:", error);
      throw new Error("Failed to fetch transaction status");
    }
  }
}
