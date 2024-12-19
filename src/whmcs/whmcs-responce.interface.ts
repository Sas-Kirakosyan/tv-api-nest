export interface WhmcsCreateClientSuccessResponse {
  result: string;
  clientid: number;
  owner_id: number;
}

export interface WhmcsCreateClientErrorResponse {
  message: string;
  statusCode: number;
}

export type WhmcsCreateClientResponse =
  | WhmcsCreateClientSuccessResponse
  | WhmcsCreateClientErrorResponse;
