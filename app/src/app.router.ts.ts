import { Routes } from '@nestjs/core'
import { LogsModule } from '@main/logs/logs.module'
import { UserModule } from '@main/user/user.module'
import { FileHandlerModule } from '@main/file-uploader/file-handler.module'


export default [
  {
    path: 'api',
    children: [
      { path: 'loggings', module: LogsModule },
      { path: 'file-handler/', module: FileHandlerModule },
      { path: '/', module: UserModule }
    ]
  }
] as Routes