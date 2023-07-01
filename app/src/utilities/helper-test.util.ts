import { HttpStatus } from "@nestjs/common"
import { IPayloadResponse, Response } from "./helper-type.util"

export const mockResponse = (mapping: (statusCode: HttpStatus, responsePayload?: IPayloadResponse) => any): Partial<Response> => ({
  asJson: jest.fn((x: any, c: any) => {
    return mapping(x, c)
  })
})


export interface IRollbackSchemaOnTest {
  mode: 'INSERT' | 'UPDATE',
  identifier: string
}