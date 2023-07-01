import { RequestMethod } from '@nestjs/common'
import * as request from  'supertest'
import { TQueryFindParams } from './helper-type.util'

const testingToken = 'CRUD2023 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.U2FsdGVkX1/tYrmo/7zzTDHDwNeFaZADUeQRjX4ooLlirZfsN4LeCFfD8c1hMPjpk1TRf1oMH5glOHzTMz3AMspRK8Jpg4xZ8vDdEPzyG8TCaTOcqhtKgLrieqYxVoqBlrNr+OnqHZsk/qM+RmYZEu8N+bxecVKTbmHZQHChS+GCRO8UNovp8bdpUFO5XuAA.roWjQjkpBPVts3mvpl4miI3zF-cCqVS8ScyFSSkL4Qk'

// get property of enum Request Method
export type TRequestMethod = keyof { [Px in keyof typeof RequestMethod]: true }

const host = 'http://localhost:3000'
export type IRequestMockCallback = <Q, DTO = {}> (method: TRequestMethod, target: string, query?: TQueryFindParams<Q>, body?: DTO) => 
request.Test


export function requestMock (httpServer: any): IRequestMockCallback {
  return <Q, DTO = {}> (method: TRequestMethod, target: string, query: TQueryFindParams<Q> = {}, body?: DTO): request.Test => {
    let urls: string = target
    let queryString: string[] = []
    const queryParams: any = Object.keys(query)
    
    for(let a in queryParams) {
      const keys = queryParams[a]
      queryString.push(`${keys}=${query[keys]}`)
    }

    if(queryParams.length > 0 && urls[urls.length - 1] !== '?') target += '?'
    target += queryString.join('&')

    const xhttp = (request(httpServer)[method.toString().toLocaleLowerCase()](target) as request.Test)
    return method !== 'GET' ? xhttp.set('authorization', testingToken)
      : xhttp
        .set('authorization', testingToken)
        .send(body as any)
  }
}