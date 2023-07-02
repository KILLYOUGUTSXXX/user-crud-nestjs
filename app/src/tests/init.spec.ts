import { AppModule } from "@app-module"
import { ILogs } from "@common-ifaces/logs/logs.iface"
import { LogsModule } from "@main/logs/logs.module"
import { UserModule } from "@main/user/user.module"
import { Test, TestingModule } from "@nestjs/testing"
import { DatabaseService, TGetCollection } from "@utilities/db-connection.util"
import { ISequencePayload, ISharedTesting, TSequentiallyTesting } from "@utilities/helper-test.util"
import { Collection } from "mongoose"
import { requestMock, IRequestMockCallback } from '@utilities/mock-request'
import * as path from 'path'
import { ValidationPipe } from "@nestjs/common"

const initPath = path.join(__dirname, 'integrations')
let registerFiles = []

try {
  registerFiles = require(path.join(__dirname, '_config', 'register-files.json'))
} catch (er) {
  registerFiles = []
}

type TReconditionSequentialFunction = { [K: string]: { classes: TSequentiallyTesting, path: string } }

describe('Sequential testing', () => {
  let shared: ISharedTesting = {
    token: null
  }
  let mockRequest: IRequestMockCallback
  let getCollection: TGetCollection
  let modules: TestingModule

  const paramsTesting: ISequencePayload = {
    getDeps: () => ({ modules, getCollection, mockRequest }),
    getShared: () => shared,
    setShared: (key: string, values: any) => Object.assign(shared, { [key]: values })
  }

  describe('Initialize Testing', () => {
    beforeEach(async () => {
      modules = await Test.createTestingModule({
        imports: [
          AppModule,
          LogsModule,
          UserModule
        ],
        providers: [DatabaseService]
      }).compile();
      
      const app = modules.createNestApplication()
      app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
      
      await app.init()
      

      // services = module.get<LogsService>(LogsService)
      getCollection = <T> (collection: string): Collection<T> => (
        modules.get<DatabaseService>(DatabaseService).getCollection<T>(collection)
      )
      mockRequest = requestMock(app.getHttpServer())
    })

    it('INIT SUCCESS', async () => {})
  })

  
  const flatFn: TReconditionSequentialFunction = loadFunctions()
  describe('Running up the test', () => {
    const flatKeys: string[] = Object.keys(flatFn)
    for(let o in flatKeys) {
      flatFn[flatKeys[o]].classes(paramsTesting)
    }
  })
})


// Load all function from other allowed files before start the automation testing.
function loadFunctions () {
  try {
    let flatFn: any = {}
    for(let a in registerFiles) {
      const CurrClass = require(path.join(initPath, registerFiles[a]))
      for(let x in CurrClass) {
        if(CurrClass[x] instanceof Function && x.match(/(\$[0-9]+)_[a-zA-Z0-9_]+/g)) {
          // filter name of function, that can be as a testing stage.
          const keys = x.split('_')[0].replace(/[^\d]/g, '')

          if(flatFn[keys] instanceof Function) {
            throw new Error(`\x1b[1m\x1b[41mConflict index of ${keys} for \x1b[37m\x1b[41m${registerFiles[a]} -> ${x}\x1b[0m`)
          }

          Object.assign(flatFn, { [keys]: { classes: CurrClass[x], path: registerFiles[a] } })
          console.info(`\x1b[32m\x1b[1m[Log]\x1b[0m Collecting function strategy "${x}" from \x1b[4m${registerFiles[a]}\x1b[0m.`)
        }      
      }
    }

    return flatFn
  } catch (er) {
    console.log(er.message)
    process.exit()
  }
}