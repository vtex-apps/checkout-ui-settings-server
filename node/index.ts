import { ClientsConfig, method, ParamsContext, RecorderState, Service, ServiceContext } from '@vtex/api'

import { Clients } from './clients'
import { enabledService } from './middlewares/enabled'
import { getSettingsFromContext } from './middlewares/settings'

const TIMEOUT_MS = 800

declare global {
  type Context = ServiceContext<Clients, RecorderState, ParamsContext>
}

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    masterdata: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  routes: {
    enabled: method({
      GET: [enabledService],
    }),
    files: method({
      GET: [getSettingsFromContext],
    }),
  },
})
