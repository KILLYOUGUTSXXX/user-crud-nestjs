import * as morgan from 'morgan'
import ShortUniqueId from "short-unique-id"
import * as moment from "moment"
import getValidations from '@utilities/ValidateRequest/engine.vreq.util'
import { NextFunction } from 'express'
import { Request, Response, TPureUAParser } from '@utilities/helper-type.util'
import * as uaParser from 'ua-parser-js'
import { NestMiddleware } from '@nestjs/common'
import { TCombineOptValidate, TValidateRequest } from '@utilities/ValidateRequest/type.vreq.util'

const UUID = new ShortUniqueId({ length: 16 })

const regexLocalhost = '(\:\:1|:1|127.0.0.1|localhost|local|)'

// Transpose the user-agent to be client-informations
function recustomUserAgent (ua: TPureUAParser) {
  return ({
    browser: typeof ua.browser?.name === 'string' ? `${ua.browser.name} [${ua.browser.version}]`.toUpperCase() : null,
    engine: typeof ua.engine?.name === 'string' ? `${ua.engine.name} [${ua.engine.version}]`.toUpperCase() : null,
    os: typeof ua.os?.name === 'string' ? `${ua.os.name} [${ua.os.version}]`.toUpperCase() : null,
    device: typeof ua.device?.vendor === 'string' || typeof ua.device?.type === 'string' ? `${ua.device.vendor} ${ua.device.model} [${ua.device.type}]`.toUpperCase() : null,
    cpu: typeof ua.cpu?.architecture === 'string' ? ua.cpu.architecture.toUpperCase() : null
  })
}

// Assign a extended informations for "Request Client"
function assignInformationRequest (req: Request, res: Response, configValidations: TValidateRequest) {
  const ipAddress = (((req.headers['x-forwarded-for'] || '').toString()).split(',').pop().trim() || req.socket.remoteAddress || '').toString()

  req.id = UUID.stamp(24).match(/.{3,5}/g).join('-')
  req.at = moment().unix()

  req.validations = getValidations(configValidations, req)

  req['client_informations'] = {
    ...recustomUserAgent(uaParser(req.headers['user-agent'])),
    ip_addr: ipAddress.match(new RegExp(regexLocalhost, 'g')) ? '0.0.0.0' : ipAddress
  }
}

export default function InitMiddleware (configValidations: TValidateRequest) {
  return class implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      assignInformationRequest(req, res, configValidations)
      const pathUrls = req.baseUrl
      const validations = req.validations as TCombineOptValidate
      morgan.token('id', (req: any) => req.id)
      morgan.token('auth', (req: any) => (typeof validations.auth === 'boolean' && validations.auth || typeof validations.auth !== 'boolean') ? 'YES' : 'NO')
      morgan.token('pathUrls', () => pathUrls)
      morgan.token('logging', () => !validations.logging ? 'NO' : 'YES')
      morgan.token('at', (req: any) => moment(req.at * 1000).format('DD/MM/YY HH:mm:ss'))

      next()
    }
  }
}