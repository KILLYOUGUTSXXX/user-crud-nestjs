import { TValidateRequest } from "@utilities/ValidateRequest/type.vreq.util";
import * as protectStrategy from '@utilities/protect-strategy.util'

export default ({
  '/api/loggings': {
    'GET': {
      code: 'GET-LOGGING',
      name: 'Get Logs API',
      logging: false,
      protect: protectStrategy.basicProtect
    }
  },
  '/api/users': {
    'GET': {
      code: 'GET-SOME-USER',
      name: 'Get Some Users API',
      logging: true,
      protect: protectStrategy.basicProtect
    }
  },
  '/api/users/disabled': {
    'POST': {
      code: 'BAN-USER',
      name: 'User banned API',
      logging: true,
      protect: protectStrategy.basicProtect
    }
  },
  '/api/users/enabled': {
    'POST': {
      code: 'DISBAN-USER',
      name: 'User disbanned API',
      logging: true,
      protect: protectStrategy.basicProtect
    }
  },
  '/api/getProfile': {
    'GET': {
      code: 'GET-USER-PF',
      name: 'Get user profiles',
      logging: true,
      protect: protectStrategy.basicProtect
    }
  },
  '/api/register': {
    'POST': {
      code: 'USER-REG',
      name: 'Register new user',
      logging: true,
      auth: false
    }
  },
  '/api/login': {
    'POST': {
      code: 'USER-LOGIN',
      name: 'Login user',
      logging: true,
      auth: false
    }
  },
  '/api/updateProfile': {
    'PATCH': {
      code: 'UPD-USER-PF',
      name: 'Update user profiles',
      logging: true
    }
  },
}) as TValidateRequest