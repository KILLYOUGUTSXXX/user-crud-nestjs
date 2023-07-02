import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream')
import * as path from 'path'

const TListFolderPathType = ['IMAGE'] as const
const getBaseDestination = (_on: typeof TListFolderPathType[number]): string => ({
  prod: {
    IMAGE: 'PRODUCTION/IMAGE_FILES'
  },
  dev: {
    IMAGE: 'DEVELOPMENT/IMAGE_FILES'
  },
  test: {
    IMAGE: 'TESTING/IMAGE_FILES'
  }
})[process.env['NEST_ENV']][_on]

@Injectable()
export class CloudinaryService {

  async uploadImage(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({
        folder: getBaseDestination('IMAGE'),
        image_metadata: true
      }, (error, result) => {
        if (error) return reject(error)
        resolve(result)
      })
      toStream(file.buffer).pipe(upload)
    })
  }

  async deleteFileInFolder (baseType: typeof TListFolderPathType[number], specificPath: string = '')
    : Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = v2.api.delete_resources_by_prefix(
        path.join(getBaseDestination(baseType), specificPath),
        (error, result) => {
          if (error) return reject(error);
          resolve(result)
        })
    })
  }
}