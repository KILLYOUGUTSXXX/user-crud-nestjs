import { Routes } from '@nestjs/core'
import { LogsModule } from '@main/logs/logs.module'
import { UserModule } from '@main/user/user.module'


export default [
  {
    path: 'api',
    children: [
      { path: 'loggings', module: LogsModule },
      { path: '/', module: UserModule }
    ]
  }
] as Routes