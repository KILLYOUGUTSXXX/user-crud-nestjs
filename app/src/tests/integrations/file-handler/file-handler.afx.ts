import { IUsers } from "@common-ifaces/users/user-info.iface"
import { TSequentiallyTesting } from "@utilities/helper-test.util"
import { IRequestMockCallback } from "@utilities/mock-request"
import * as path from 'path'

export const $01_fileHandler: TSequentiallyTesting<void> = ({ getDeps, getShared }) => {
  let request: IRequestMockCallback
  let auth: string
  
  beforeEach(async () => {
    request = getDeps().mockRequest
    auth = getShared().token
  })

  it('Test api "/api/file-handler/upload-image", to upload an image, must return url from cloudinary resources.', async () => {
    const response = await request({
      method: 'POST',
      target: '/api/file-handler/upload-image',
      authorization: auth,
      attachFile: path.resolve(global.__basedir, '../assets/test-image.jpg')
    })

    expect(typeof response?.body?.data?.url === 'string').toBe(true)
  })
}

