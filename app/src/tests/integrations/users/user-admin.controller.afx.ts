import { ILogs } from '@common-ifaces/logs/logs.iface'
import { TSequentiallyTesting } from '@utilities/helper-test.util'
import { IRequestMockCallback } from '@utilities/mock-request'
import * as adminStubs from '@test-stubs/user-admin.stub'


export const $3_userAdminControllers: TSequentiallyTesting<void> = ({ getDeps, getShared }) => {
  let request: IRequestMockCallback
  let auth: string = null

  beforeEach(async () => {
    request = getDeps().mockRequest
    auth = getShared().adminToken
  })

  validateIsTokenReceived(() => auth)
  getSomeUsers(() => request, () => auth)
  bannedUser(() => request, () => auth)
}


export const $2_loginAsAdministrator: TSequentiallyTesting<void> = ({ getDeps, getShared, setShared }) => {
  let request: IRequestMockCallback
  let auth: string = null

  beforeEach(async () => {
    request = getDeps().mockRequest
    auth = getShared().token
    setShared = setShared
  })

  it('Login as administrator using routes "/api/login", must return token.', async () => {
    const response = await request({
      target: '/api/login',
      body: adminStubs.adminLogin(),
      method: 'POST'
    })
    
    const newToken = response.body?.data?.token

    setShared('adminToken', newToken)
    expect(response.statusCode).toBe(200)
    expect(typeof newToken === 'string').toBe(true)
  })
}


function getSomeUsers (request: () => IRequestMockCallback, auth: () => string) {
  it('Test api "/api/users".', async () => {
    const response = await request()<ILogs>({
      method: 'GET',
      authorization: auth(),
      query: { _page: 1, _pageSize: 1 },
      target: '/api/users'
    })
    
    const dataBody = response.body?.data

    expect(response.statusCode).toBe(200)
    expect(dataBody?.page).toBe(1)
    expect(dataBody?.pageSize).toBe(1)
    expect(typeof dataBody?.total === 'number').toBe(true)
    expect(Array.isArray(dataBody?.data)).toBe(true)
  })
}

function validateIsTokenReceived (adminToken: () => string) {
  it('Make sure the admin token is stored, and ready to use.', async () => {
    expect(typeof adminToken() === 'string').toBe(true)
  })
}


function bannedUser (request: () => IRequestMockCallback, adminToken: () => string) {
  it('Test api "/api/users/disabled".', async () => {
    const response = await request()<ILogs>({
      method: 'POST',
      authorization: adminToken(),
      target: '/api/users/disabled',
      body: adminStubs.bannedUser()
    })
    
    const dataBody = response.body?.data

    expect(response.statusCode).toBe(200)
  })
}


export const $5_disbanUser: TSequentiallyTesting<void> = ({ getDeps, getShared }) => {
  let request: IRequestMockCallback
  let auth: string = null

  beforeEach(async () => {
    request = getDeps().mockRequest
    auth = getShared().adminToken
  })

  it('Test api "/api/users/enabled".', async () => {
    const response = await request<ILogs>({
      method: 'POST',
      authorization: auth,
      target: '/api/users/enabled',
      body: adminStubs.bannedUser()
    })
    
    const dataBody = response.body?.data

    expect(response.statusCode).toBe(200)
  })
}
