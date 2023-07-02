import { IUsers } from "@common-ifaces/users/user-info.iface"
import { TSequentiallyTesting } from "@utilities/helper-test.util"

export const $1000_finishing: TSequentiallyTesting<void> = ({ getDeps }) => {
  describe('CLEAN UP THE TEST', () => {
    it('Delete inserted data logs.', async () => {
      const { getCollection } = getDeps()
      const logModels = getCollection<any>('cl_logs')
      
      await logModels.deleteMany({})
      const lengthNow: number = await logModels.countDocuments()

      expect(lengthNow === 0).toBe(true)
    })

    it('Delete inserted data users.', async () => {
      const { getCollection } = getDeps()
      const userModels = getCollection<IUsers>('cl_users')
      
      await userModels.deleteMany({ is_admin: { $eq: false } })
      const lengthNow: number = await userModels.countDocuments()

      expect(lengthNow === 1).toBe(true)
    })
  })
}

