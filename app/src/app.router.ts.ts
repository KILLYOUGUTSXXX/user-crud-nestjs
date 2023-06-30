import { Routes } from '@nestjs/core'
import { LogsModule } from './logs/logs.module'
import { UserModule } from './user/user.module'


export default [
  {
    path: 'api',
    children: [
      { path: 'loggings', module: LogsModule },
      { path: '/', module: UserModule }
      // { path: '/', module: LogsModule }
    ]
  }
] as Routes