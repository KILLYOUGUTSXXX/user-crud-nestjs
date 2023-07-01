import { NextFunction } from "express";
import { RequestMethod } from "@nestjs/common"
import { IJwtPayload, Request } from "@utilities/helper-type.util";

export interface IProtectProps {
  /** Able to consuming authentication payload (only work if status of "auth" is true) */
  authPayload: IJwtPayload,
  /** Able to consuming request payload */
  requestPayload: Request
}

// Global typeof Option Validate
type OptValidateX = {
  /** Name of route.*/
  name: string

  /**
   Code of route, the "Code" must be unique
  */
  code: string

  /** If set to "true", the logs would be save to DB (Default: true)*/
  logging?: boolean

  /** If set to "false" the request would not be authenticated with (Default: true).*/
  auth?: boolean

  /** To protect the routes, when the return is "false" the request would be return error 403.*/
  protect?: ((props: IProtectProps, next: NextFunction) => void | null)
}


// only use in GET methods
type OptValidateA = {}

// use in except of GET methods
type OptValidateB = {
  /** The max of size body in Megabyte (MB).*/
  maxBodySize?: number 
}

export interface TCombineOptValidate extends OptValidateX, OptValidateA, OptValidateB {}

export type TValidateRequest = {
  [key: string]: {
    [Px in keyof typeof RequestMethod]+?: {
      [Ox in keyof (OptValidateX & (Px extends 'GET' ? OptValidateA : OptValidateB))]
        : (OptValidateX & (Px extends 'GET' ? OptValidateA : OptValidateB))[Ox]
    }
  }
}