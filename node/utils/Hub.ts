import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

const routes = {
  schemas: (dataEntity: string) => `${dataEntity}/schemas/`,
}

export default class RequestHub extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://api.vtex.com/api/dataentities`, context, {
      ...options,
      headers: {
        Accept: 'application/json',
        VtexIdclientAutCookie: context.authToken,
        'x-vtex-api-appService': context.userAgent,
        ...options?.headers,
      },
      params: {
        an: context.account,
        ...options?.params,
      },
    })
  }

  public getSchemas() {
    return this.http.getRaw(routes.schemas('checkoutcustom'))
  }
}
