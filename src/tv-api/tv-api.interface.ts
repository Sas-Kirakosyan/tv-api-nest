export interface CreateLineData {
  line_type: string;
  package: number;
  description: string;
  username: string;
  password: string;
}

export interface CreateLineSuccessResponse {
  result: boolean;
  message: string | Record<string, any>;
  id: number;
  username: string;
  password: string;
  expire_date: number;
}

interface CreateLineErrorResponse {
  result: boolean;
  message: string | Record<string, any>;
}

export type CreateLineResponse = CreateLineSuccessResponse | CreateLineErrorResponse;
