import { ConfigOptions, v2 } from 'cloudinary'

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): void => {
    v2.config({
      cloud_name: process.env['AFX_CLOUD_NAME'],
      api_key: process.env['AFX_CLOUD_KEY'],
      api_secret: process.env['AFX_CLOUD_SECRET'],
    })
  }
};