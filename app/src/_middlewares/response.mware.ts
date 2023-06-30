import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response as ExpressResponse } from 'express';
import { Request, Response } from '@utilities/helper-type.util'
import * as moment from 'moment';
import { LogsService } from '../logs/logs.service'
import { TCombineOptValidate } from '@utilities/ValidateRequest/type.vreq.util';


@Injectable()
export default class ResponseMiddleware implements NestMiddleware {
  private validate: any = null
  private partialData: Object = null
  constructor(private readonly logService: LogsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.validate = (req.validations as TCombineOptValidate)

    const rawResponseEnd = res.end;
    const chunkBuffers = [];

    // Assign custom response of JSON
    res.asJson = (statusCode, payloadResponse, logData) => {
      this.partialData = (logData || null)
      
      return res.status(statusCode).json({
        reqId: req.id,
        statusCode,
        success: true, 
        message: payloadResponse.message,
        detailMessage: payloadResponse.detailMessage,
        data: (payloadResponse.data || undefined),
        page: (payloadResponse.page || undefined),
        pageSize: (payloadResponse.pageSize || undefined),
        total: (payloadResponse.total || undefined)
      })
    }

    res.end = (...chunk) => {
      const resAt = moment()
      res.setHeader('Last-Modified', (new Date()).toUTCString())

      const resArgs = [];
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      const body = Buffer.concat(chunkBuffers).toString('utf8');
      const dataBody = body ? JSON.parse(body) : null

      const responseLog = {
        reqId: req.id,
        clientInformations: req.client_informations,
        statusCode: res.statusCode,
        reqAt: req.at,
        resAt: resAt.unix(),
        data: dataBody
      }
      
      if(typeof this.validate?.logging === 'boolean' && this.validate?.logging) {
        // Store log response to store data
        let tmpMsg = responseLog.data?.message
        if(Array.isArray(responseLog.data?.message)) {
          tmpMsg = responseLog.data?.message[0]
        } else if (typeof responseLog.data?.message === 'object') {
          tmpMsg = 'Somemthing wrong'
        }
        this.logService.createLogs({
          res_code: responseLog.statusCode.toString(),
          ids: responseLog.reqId,
          code: this.validate.code,
          name: this.validate.name,
          partial_data: this.partialData,
          req_at: responseLog.reqAt,
          res_at: responseLog.resAt,
          res_msg: tmpMsg,
          client_info: responseLog.clientInformations as any
        })
      }

      rawResponseEnd.apply(res, resArgs);
      return responseLog as unknown as Response;
    }

    next()
  }
}



