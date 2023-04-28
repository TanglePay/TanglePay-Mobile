import { Base } from '@tangle-pay/common'

export const StorageFacade = {
    get: async (key) => {
        return await Base.getLocalData(key)
    },
    set: (key, value) => {
        Base.setLocalData(key, value)
    }
}