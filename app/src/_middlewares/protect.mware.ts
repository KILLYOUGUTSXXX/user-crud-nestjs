import { HttpStatus, NestMiddleware } from "@nestjs/common";
import { NextFunction } from 'express'
import { Request, Response } from '@utilities/helper-type.util'
import { TCombineOptValidate } from "@utilities/ValidateRequest/type.vreq.util";

export declare type TExecValidateRequest = { desc: string, code?: string, name?: string }

export default class ProtectMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const validations = req.validations as TCombineOptValidate
    try {
      if(typeof validations.protect === 'function') {
        return await validations.protect({ authPayload: req.user_auth, requestPayload: req }, next)
      }
      return next()
    } catch (er) {
      res.asJson(HttpStatus.FORBIDDEN, { message: er.message })
    }
    
  }
}