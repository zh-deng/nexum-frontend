export type SignUpDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email?: string;
  username?: string;
};
