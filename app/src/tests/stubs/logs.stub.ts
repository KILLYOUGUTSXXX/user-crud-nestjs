import { HttpStatus } from "@nestjs/common";
import { ILogs } from "@common-ifaces/logs/logs.iface";
import * as moment from "moment";

export const insertLog = (): ILogs => ({
  ids: 'a26x-019kd-029k-1998',
  client_info: {
    browser: 'Chrome [103.1.1]',
    cpu: 'x86',
    device: null,
    engine: null,
    os: null
  },
  code: 'TEST',
  name: 'TESTING',
  req_at: moment().subtract(1, 'minute').unix(),
  res_msg: 'OK',
  res_at: moment().unix(),
  res_code: HttpStatus.OK.toString(),
  partial_data: {}
})