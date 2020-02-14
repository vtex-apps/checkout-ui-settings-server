import { removeVersionFromAppId } from '@vtex/api'

import { LINKED } from '../constants'

function parseFileFromURL(url: string) {
  return url.split('/')[2]
}

export async function getSettingsFromContext(ctx: Context, next: () => Promise<any>) {
  const {
    request: { url },
  } = ctx
  const file = parseFileFromURL(url)

  console.log({ctx, url, file})

  if (!file || !(typeof file === 'string')) {
    throw new Error('Error parsing settings file from URL.')
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
