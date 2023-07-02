import { ExecutionContext, Injectable, Query, Req, createParamDecorator } from "@nestjs/common"
import { InjectModel } from '@nestjs/mongoose'
import { IUsers } from '@common-ifaces/users/user-info.iface'
import { Model } from 'mongoose'
import { TAttributes, TQueryFindParams, TReturnGetSomeData, TModeAttributes, IJwtPayload, IRequestPayloads } from '@utilities/helper-type.util'
import { queryGenerator } from '@utilities/query-generator.util'
import * as encryptions from "@utilities/encryption.util";
import * as moment from "moment"
import { generateHoroscope, generateZodiac } from "@utilities/func.util"
import { IJwtCustom, JwtCustom } from "@utilities/token-generator.util"
import { UserActivateDTO } from "@common-dtos/users/activation-user.dto"
import { LoginUserDTO } from "@common-dtos/users/login-user.dto"
import { ChangePasswordUserDTO } from "@common-dtos/users/change-password-user.dto"
import { RegisterUserDTO } from "@common-dtos/users/register-user.dto"
import { UpdateBasicInfoUserDTO } from "@common-dtos/users/update-basic-info.dto"

const attributes: TAttributes<IUsers> = {
  mf: [
    'user_name', 'display_name', 'email', 'email_verify', 'gender', 'horoscope', 'interest', 'status', 'disable_reason', 'password', 'tmp_password', 'is_admin', 'height', 'weight', 'curr_img_url', 'zodiac', 'created_at', 'last_update_at'
  ],
  bf: [
    'user_name', 'display_name', 'email', 'email_verify', 'gender', 'horoscope', 'interest', 'status', 'disable_reason',
    'height', 'weight', 'curr_img_url', 'zodiac', 'created_at', 'last_update_at', 'is_admin'
  ],
  mnf: [
    'user_name', 'display_name', 'email', 'gender', 'horoscope', 'interest', 'height', 'weight', 'curr_img_url', 'zodiac'
  ]
}


@Injectable()
@JwtCustom('jwtCustom')
export class UserService {
  jwtCustom: IJwtCustom
  constructor(
    @InjectModel('cl_users') private userModels: Model<IUsers>,
  ) {}

  async getSomeUsers (query: TQueryFindParams<IUsers>): Promise<TReturnGetSomeData<IUsers>> {
    const tmpAttributes = (attributes[query._mode] || attributes.mnf)
    const queries = queryGenerator(attributes.mf, query, true)
    
    return this.userModels
      .find({ ...queries.filtered })
      .count()
      .then(c => {
        return this.userModels
          .aggregate([
            { $match: { ...queries.filtered } },
            { $project: tmpAttributes.reduce((a, b) => ({ ...a, [b]: 1 }), { _id: 0 }) },
            { $skip: queries.offset },
            { $limit: queries.limit }
          ]).then(a => ({ data: a, total: c, page: queries.page, pageSize: queries.limit }))
      })
  }

  private async getOneUser (userName: string, mode?: TModeAttributes): Promise<IUsers> {
    const tmpAttributes = (attributes[mode as string] || attributes.mnf)
    return this.userModels
      .findOne(
        { user_name: userName },
        { ...tmpAttributes.reduce((a, b) => ({ ...a, [b]: 1 }), { _id: 0 }) }
      )
  }

  async getUserIfExists (userName: string, mode?: TModeAttributes): Promise<IUsers> {
    try {
      const currentUser = await this.getOneUser(userName, mode)

      if(!currentUser) throw new Error('User not found.')
      else if(!currentUser.status) throw new Error(`User has been disabled, Reason: ${currentUser.disable_reason}.`)

      return currentUser
    } catch (er) {
      throw new Error(er.message)
    }
  }

  async registerUser (data: RegisterUserDTO): Promise<IUsers> {
    try {
      const encPassword = encryptions.encryptPassword(data.password)
      
      const createUser = await new this.userModels({
        ...data,
        is_admin: false,
        password: [encPassword.hash, encPassword.salt].join(' '),
        created_at: moment().unix()
      })
      return createUser.save()
    } catch (er) {
      throw new Error(er.message)
    }
  }

  
  async loginUser (data: LoginUserDTO, client_info: any): Promise<{ token: string }> {
    try {
      const currentUser = await this.getUserIfExists(data.user_name, 'mf')
      const [_hash, _salt] = currentUser.password.split(' ')
      const newEnc = encryptions.hashing(data.password, _salt)

      if(newEnc.hash !== _hash) throw new Error('Wrong password.')

      const userAuthPayload: IJwtPayload = {
        user_name: currentUser.user_name,
        ip_addr: client_info.ip_addr,
        is_admin: currentUser.is_admin
      }
      return { token: await this.jwtCustom.generateToken(userAuthPayload) }
    } catch (er) {
      throw new Error(er.message)
    }
  }

  async updateBasicInfoUser (userName: string, data: UpdateBasicInfoUserDTO): Promise<boolean> {
    try {
      await this.getUserIfExists(userName, 'mf')
      const stringBirthday = data.birthday ? moment(data.birthday).startOf('day').format('YYYY-MM-DD') : null
      await this.userModels.updateOne(
        { user_name: userName } as IUsers,
        {
          ...data,
          ...(stringBirthday ? {
            zodiac: stringBirthday ? generateZodiac(stringBirthday) : null,
            horoscope: stringBirthday ? generateHoroscope(stringBirthday) : null
          } : {}),
          last_update_at: moment().unix()
        } as UpdateBasicInfoUserDTO
      )
      return true
    } catch (er) {
      throw new Error(er.message)
    }
  }

  async changePasswordUser (userName: string, data: ChangePasswordUserDTO): Promise<boolean> {
    try {
      const currentUser = await this.getUserIfExists(userName, 'mf')

      const [_hash, _salt] = currentUser.password.split(' ')
      const encPassword = encryptions.encryptPassword(data.newPassword)
      const newEnc = encryptions.hashing(data.oldPassword, _salt)

      if(newEnc.hash !== _hash) throw new Error('Wrong old password.')

      await this.userModels.updateOne(
        { user_name: userName, password: [encPassword.hash, encPassword.salt].join(' ') } as IUsers,
        {
          last_update_at: moment().unix()
        } as IUsers
      )
      return true
    } catch (er) {
      throw new Error(er.message)
    }
  }

  async bannedUser (data: UserActivateDTO): Promise<boolean> {
    try {
      const currentUser = await this.getUserIfExists(data.user_name, 'mf')
      if(!currentUser.status) throw new Error('User has been disabled before.')
      else if(currentUser.is_admin) throw new Error('Cannot disabled user admin.')

      await this.userModels.updateOne(
        { user_name: data.user_name } as IUsers,
        {
          status: false,
          disable_reason: data.reason,
          last_update_at: moment().unix()
        } as IUsers
      )
      return true
    } catch (er) {
      throw new Error(er.message)
    }
  }

  async disBannedUser (userName: string): Promise<boolean> {
    try {
      const currentUser = await this.getOneUser(userName, 'mf')
      
      if (!currentUser) throw new Error('User not found.')
      else if (currentUser.status) throw new Error('User is not disabled.')
      else if(currentUser.is_admin) throw new Error('Cannot enabled user admin.')
      await this.userModels.updateOne(
        { user_name: userName } as IUsers,
        {
          status: true,
          disable_reason: null,
          last_update_at: moment().unix()
        } as IUsers
      )
      return true
    } catch (er) {
      throw new Error(er.message)
    }
  } 
}
