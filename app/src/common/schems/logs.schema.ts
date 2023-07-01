import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Mixed } from 'mongoose';

export type UserDocument = HydratedDocument<Logs>;

class ClientInfoSchema {
  browser: string
  engine: string
  os: string
  device: string
  cpu: string
}


@Schema({ timestamps: false, versionKey: false, collection: 'cl_logs' })
export class Logs {
  @Prop({ required: true, unique: true })
  ids: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, required: false })
  partial_data: Object;
  
  @Prop({ type: ClientInfoSchema, required: true })
  client_info: ClientInfoSchema;

  @Prop({ required: false })
  res_code: string;

  @Prop({ required: false })
  res_msg: string;

  @Prop({ required: true })
  req_at: number;

  @Prop({ required: false })
  res_at: number;
}

export const LogSchema = SchemaFactory.createForClass(Logs);
