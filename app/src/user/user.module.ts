import { DynamicModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAdminController } from './user-admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'cl_users', schema: UserSchema }])
  ],
  controllers: [UserController, UserAdminController],
  providers: [UserService]
})
export class UserModule {}
