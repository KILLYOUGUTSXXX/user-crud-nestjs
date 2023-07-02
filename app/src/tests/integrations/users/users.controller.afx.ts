import { requestMock, IRequestMockCallback } from '@utilities/mock-request'
import { ISharedTesting, TSequentiallyTesting } from '@utilities/helper-test.util'
import * as userStubs from '@test-stubs/user.stub'


export const $1_userControls01: TSequentiallyTesting = ({ getDeps, setShared, getShared }) => {
  let request: IRequestMockCallback
  let token: string

  beforeEach(async () => {
    request = getDeps().mockRequest
    token = getShared().token
  })
  
  userRegister(() => request)
  userLogin(() => request, setShared)
  validateIsTokenReceived(() => token)
}

export const $001_userControls02: TSequentiallyTesting = ({ getDeps, setShared, getShared }) => {
  let request: IRequestMockCallback
  let token: string

  beforeEach(async () => {
    request = getDeps().mockRequest
    token = getShared().token
  })
  
  updateProfile(() => request, () => token)
  getProfile(() => request, () => token)
}

export

function userRegister (request: () => IRequestMockCallback) {
  it('Test api "/api/register", must return status code 200', async () => {
    const response = await request()({
      target: '/api/register',
      body: userStubs.userRegister(),
      method: 'POST'
    })


    expect(response.statusCode).toBe(200)
  })
}

function userLogin (request: () => IRequestMockCallback, setShared: (key: string, values: any) => void) {
  it('Test api "/api/login", must return token.', async () => {
    const response = await request()({
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

function updateProfile (request: () => IRequestMockCallback, token: () => string) {
  it('Test api "/api/updateProfile", must return status 200.', async () => {
    const response = await request()({
      target: '/api/updateProfile',
      body: userStubs.userLogin(),
      method: 'PATCH',
      authorization: token()
    })

    expect(response.statusCode).toBe(200)
  })
}

function getProfile (request: () => IRequestMockCallback, token: () => string) {
  it('Test api "/api/getProfile", must return status 200.', async () => {
    const response = await request()({
      target: '/api/getProfile',
      method: 'GET',
      authorization: token()
    })

    expect(response.statusCode).toBe(200)
  })
}

function validateIsTokenReceived (token: () => string) {
  it('Make sure the token is stored, and ready to use.', async () => {
    expect(typeof token() === 'string').toBe(true)
  })
}
