import { MiddlewareConsumer, Module, NestModule, Type } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware, InitMiddleware, ProtectMiddleware, RequestBodyMiddleware, ResponseMiddleware } from "@middlewares";
import routerConfig from "./app.router.ts";
import validationConfig from "./app.validation";
import { destructModuleFromRoutes } from "@utilities/func.util";
import { LogSchema } from '@common-schems/logs.schema';
import { LogsService } from '@main/logs/logs.service';
import { DatabaseService } from '@utilities/db-connection.util';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: [`.env.${process.env.NEST_ENV}`], isGlobal: true }),
    ...destructModuleFromRoutes(routerConfig),
    RouterModule.register(routerConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        return {
          uri: process.env['AFX_MONGO_URI'],
          dbName: process.env['AFX_MONGO_DBNAME'],
          pass: process.env['AFX_MONGO_PSW'],
          user: process.env['AFX_MONGO_USER'],
          maxPoolSize: 50
        }
      }
    }),
    MongooseModule.forFeature([{ name: 'cl_logs', schema: LogSchema }])
  ],
  controllers: [AppController],
  providers: [AppService, LogsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InitMiddleware(validationConfig), ResponseMiddleware, RequestBodyMiddleware, AuthMiddleware, ProtectMiddleware)
      .forRoutes('*')
  }
}
