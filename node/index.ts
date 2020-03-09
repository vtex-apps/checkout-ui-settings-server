import { IOClients, LRUCache, method, ParamsContext, RecorderState, Service, ServiceContext } from '@vtex/api'

import { enabledService } from './middlewares/enabled'
import { getSettingsFromContext } from './middlewares/settings'

const memoryCache = new LRUCache<string, any>({max: 10})
metrics.trackCache('checkoutSettings', memoryCache)

declare global {
  type Context = ServiceContext<IOClients, RecorderState, ParamsContext>
}

export default new Service<IOClients, RecorderState, ParamsContext>({
  routes: {
    enabled: method({
      GET: [
        enabledService,
      ],
    }),
    files: method({
      GET: [
        getSettingsFromContext,
      ],
    }),
  },
})
