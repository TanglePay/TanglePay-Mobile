import { Base } from '@tangle-pay/common'

export const StorageFacade = {
    get: async (key) => {
        return await Base.getSensitiveInfo(key)
    },
    set: (key, value) => {
        Base.setSensitiveInfo(key, value)
    }
}