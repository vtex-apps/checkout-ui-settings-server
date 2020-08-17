import { IOClients } from '@vtex/api'

import MasterDataExtended from '../utils/MasterDataExtended'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get masterdata() {
    return this.getOrSet('masterdata', MasterDataExtended)
  }
}
