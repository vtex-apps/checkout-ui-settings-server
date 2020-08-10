import { LRUCache, method, ParamsContext, RecorderState, Service, ServiceContext, ClientsConfig } from '@vtex/api'

import { enabledService } from './middlewares/enabled'
import { getSettingsFromContext } from './middlewares/settings'
import { Clients } from './clients'

const memoryCache = new LRUCache<string, any>({max: 10})
metrics.trackCache('checkoutSettings', memoryCache)
const TIMEOUT_MS = 800

declare global {
  type Context = ServiceContext<Clients, RecorderState, ParamsContext>
}

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

console.log('>>>>>>> Server running...')

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
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
