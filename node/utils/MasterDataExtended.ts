import { MasterData } from '@vtex/api'

const routes = {
  schemas: (dataEntity: string) => `${dataEntity}/schemas/`,
}

export default class MasterDataExtended extends MasterData {
  public getSchemas() {
    return this.http.getRaw(routes.schemas('checkoutcustom'))
  }
}
