import { requestMock, IRequestMockCallback } from '@utilities/mock-request'
import { ISharedTesting, TSequentiallyTesting } from '@utilities/helper-test.util'
import * as userStubs from '@test-stubs/user.stub'


export const $4_loginAfterBanned: TSequentiallyTesting = ({ getDeps, setShared, getShared }) => {
  let request: IRequestMockCallback
  let token: string

  beforeEach(async () => {
    request = getDeps().mockRequest
    token = getShared().token
  })
  
  it('Test api "/api/login", must return token.', async () => {
    const response = await request({
      target: '/api/login',
      body: userStubs.userLogin(),
      method: 'POST'
    })

    const newToken = response.body?.data?.token

    setShared('token', newToken)
    expect(!newToken).toBe(true)
    expect(!!(response.body?.detailMessage as string).match(/has been disabled/)).toBe(true)
  })
}

export const $6_loginAfterDisbanned: TSequentiallyTesting = ({ getDeps, setShared, getShared }) => {
  let request: IRequestMockCallback

  beforeEach(async () => {
    request = getDeps().mockRequest
  })
  
  it('Test api "/api/login", must return token.', async () => {
    const response = await request({
      target: '/api/login',
      body: userStubs.userLogin(),
      method: 'POST'
    })

    const newToken = response.body?.data?.token
    setShared('token', newToken)

    expect(response.statusCode).toBe(200)
    expect(typeof newToken === 'string').toBe(true)
    expect(!!(response.body?.message as string).match(/Login is authenticated/)).toBe(true)
  })
}
