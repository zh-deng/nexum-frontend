export type SignUpDto = {
  username: string;
  email: string;
  password: string;
  signupAccessCode: string;
};

export type SignUpResponse = {
  id: string;
  username: string;
  email: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: string;
  email: string;
  username?: string;
};

export type AuthUser = {
  id?: string;
  email?: string;
  username?: string;
};
