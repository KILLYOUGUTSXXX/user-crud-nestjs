interface _IUsers {
  user_name: string;
  email: string;
  email_verify: boolean;
  password: string;
  tmp_password: string;
  display_name: string;
  birthday: Date;
  gender: string;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
  interest: string;
  curr_img_url: string;
  status: boolean;
  is_admin: boolean;
  disable_reason: string;
  created_at: number;
  last_update_at: number;
}

export interface IUsers extends Readonly<_IUsers> {}