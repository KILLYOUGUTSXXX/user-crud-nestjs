import { NextFunction } from "express"
import { IProtectProps } from "./ValidateRequest/type.vreq.util"


// Basic Implementation of protect routes, which is we would be validate the incoming request depends on "Admin Status".
export async function basicProtect ({ authPayload, requestPayload }: IProtectProps, next: NextFunction) {
  if(!authPayload.is_admin) {
    throw new Error('Sorry, only admin can be access the routes.')
  }
  next()
}