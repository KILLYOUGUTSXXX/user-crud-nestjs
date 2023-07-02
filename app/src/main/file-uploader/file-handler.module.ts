import { Module } from '@nestjs/common'
import { FileHandlerController } from "./file-handler.controller";
import { CloudinaryModule } from '@main/_helpers/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule
  ],
  controllers: [FileHandlerController],
  providers: []
})
export class FileHandlerModule {}
