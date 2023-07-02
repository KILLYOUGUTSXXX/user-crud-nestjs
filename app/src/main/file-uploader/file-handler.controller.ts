import { Response } from "@utilities/helper-type.util";
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "@main/_helpers/cloudinary/cloudinary.service";

@Controller()
export class FileHandlerController {
  constructor(private cloudinary: CloudinaryService) {}

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor(
      'file_uploaded',
      { limits: { fileSize: 1024 * 1024 } } // max 1mb
  ))
  uploadFileToCloudinary(
    @UploadedFile() file_uploaded: Express.Multer.File,
    @Res() res: Response
  ) {
    return this.cloudinary.uploadImage(file_uploaded)
      .then(result => {
        return res.asJson(HttpStatus.OK, {
          message: 'OK',
          data: { url: result.url }
        })
      }).catch(er => {
        return res.asJson(HttpStatus.BAD_REQUEST, {
          message: '[FILE-HDL-01] Failed to upload images',
          detailMessage: 'Connection failure'
        }, { message: er.message })
      })
  }
}
