import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAdminController } from './user-admin.controller';
import { UserSchema } from '@common-schems/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'cl_users', schema: UserSchema }])
  ],
  controllers: [UserController, UserAdminController],
  providers: [UserService]
})
export class UserModule {}
