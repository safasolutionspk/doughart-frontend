export type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type CustomerAuthResponse = {
  success: true;
  message: string;
  customer: CustomerProfile;
};

export type CustomerAuthError = {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
};
