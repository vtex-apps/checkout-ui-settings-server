import { IOClients, LRUCache, ParamsContext, RecorderState, Service, ServiceContext } from '@vtex/api'

import { getSettingsFromContext } from './middlewares/settings'

const memoryCache = new LRUCache<string, any>({max: 10})
metrics.trackCache('checkoutSettings', memoryCache)

declare global {
  type Context = ServiceContext<IOClients, RecorderState, ParamsContext>
}

export default new Service<IOClients, RecorderState, ParamsContext>({
  routes: {
    checkoutSettings: [
      getSettingsFromContext,
    ],
  },
})
