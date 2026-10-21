import { getApiFetchUrl } from "@/lib/config/apiUrl";

const API_BASE_URL = getApiFetchUrl();

export { API_BASE_URL };

export type BackendAuthData = {
  token: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
};

export type BackendSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type BackendFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
};
