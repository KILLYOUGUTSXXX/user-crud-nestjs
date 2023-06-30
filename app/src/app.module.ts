import { LogsService } from "./logs/logs.service";
import { DynamicModule, ForwardReference, MiddlewareConsumer, Module, NestModule, Type } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogSchema } from "./logs/entities/logs.entity";
import { AuthMiddleware, InitMiddleware, ProtectMiddleware, RequestBodyMiddleware, ResponseMiddleware } from "@middlewares";
import routerConfig from "./app.router.ts";
import validationConfig from "./app.validation";

// Load all modules from routes
function destructModuleFromRoutes (routes: Routes = []): (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>)[] {
  return routes.reduce((a, b) => {
    if(Array.isArray(b.children) && b.children.length > 0) return [...a, ...destructModuleFromRoutes(b.children as Routes)]
    else if(!b.module) return a
    
    return [...a, b.module]
  }, [])
}


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: [`.env.${process.env.NEST_ENV}`] }),
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
  providers: [AppService, LogsService, AuthMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InitMiddleware(validationConfig), ResponseMiddleware, RequestBodyMiddleware, AuthMiddleware, ProtectMiddleware)
      .forRoutes('*')
  }
}
