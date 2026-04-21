export type User = {
  user_id: number;
  username: string;
  email: string;
  phone_number: string | null;
  real_name: string;
  grad_year: number | null;
  is_oncampus: boolean;
  gender: string | null;
  major: string | null;
  home_state: string | null;
};

export type CreateUserInput = {
  username: string;
  password: string;
  email: string;
  real_name: string;
  is_oncampus: boolean;
  phone_number?: string;
  grad_year?: number;
  gender?: string;
  major?: string;
  home_state?: string;
};
