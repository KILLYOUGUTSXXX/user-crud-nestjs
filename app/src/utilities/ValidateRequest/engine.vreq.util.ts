import { Request } from '@utilities/helper-type.util'
import { TCombineOptValidate, TValidateRequest } from './type.vreq.util'

// Assign the custom validator here ...
export default (validationConfigs: TValidateRequest, req: Request): TCombineOptValidate => {
  const mappingKeys = Object.keys(validationConfigs)
  const foundUrl = mappingKeys.filter(a => {
    const _key = a.replace(/\?/g, '([a-zA-Z0-9_-]+)')
    return req.baseUrl.match(new RegExp(`^${_key}$`, 'g'))
  })[0]
  const settings = ((validationConfigs[foundUrl]?.[req.method] || null) || {})
  return settings
}