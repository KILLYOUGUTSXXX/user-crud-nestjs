import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Decimal128, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: false, versionKey: false, collection: 'cl_users' })
export class User {
  @Prop({ required: true, unique: true })
  user_name: string;
  
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false  })
  email_verify: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  tmp_password: string;

  @Prop({ default: null })
  display_name: string;

  @Prop({ type: Date, default: null })
  birthday: Date;

  @Prop({ type: String, enum: ['M', 'F', 'O', null], default: null })
  gender: string;

  @Prop({ default: null })
  horoscope: string;

  @Prop({ default: null })
  zodiac: string;

  @Prop({ default: null })
  height: number;

  @Prop({ default: null })
  weight: number;

  @Prop({ default: null })
  interest: string;

  @Prop({ default: null })
  curr_img_url: string;

  @Prop({ default: true  })
  status: boolean;
  
  @Prop({ default: false  })
  is_admin: boolean;

  @Prop({ default: null  })
  disable_reason: string;

  @Prop({ default: false, required: true })
  created_at: number; // timezone = UTC

  @Prop({ default: false, required: false })
  last_update_at: number; // timezone = UTC
}

export const UserSchema = SchemaFactory.createForClass(User);
