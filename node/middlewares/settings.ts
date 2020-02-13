import { removeVersionFromAppId, UserInputError } from '@vtex/api'

import { LINKED } from '../constants'

export async function getSettingsFromContext(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx
  const { file } = params

  console.log({'Route: ': ctx.vtex.route})

  if (!file || !(typeof file === 'string')) {
    throw new UserInputError('File is required and should be a string.')
  }

  const settingsObject = ctx.vtex.settings ? ctx.vtex.settings[0] : null
  if (!settingsObject) {
    ctx.status = 200
    ctx.body = '' // Returning empty string as custom file since no configuration app was found

    await next()
    return
  }
  const settingsDeclarer = removeVersionFromAppId(settingsObject.declarer)
  const allSettingsFromDeclarer = settingsObject[settingsDeclarer]
  const settingFile = allSettingsFromDeclarer[file]
  if (!settingFile) {
    ctx.status = 200
    ctx.body = '' // Returning empty string as custom file since the wanted custom file was not found in the configuration app

    await next()
    return
  }

  const cacheType = LINKED ? 'no-cache' : 'public, max-age=60'
  ctx.set('cache-control', cacheType)
  ctx.status = 200
  ctx.body = settingFile

  await next()
}
