import { removeVersionFromAppId } from '@vtex/api'

import { LINKED } from '../constants'

function parseFileFromURL(url: string) {
  const maybeFileWithQuery = url.split('/')[2]
  const maybeFile = maybeFileWithQuery.split('?')[0]
  return maybeFile
}

export async function getSettingsFromContext(ctx: Context, next: () => Promise<any>) {
  const {
    request: { url },
  } = ctx
  const file = parseFileFromURL(url)

  if (!file || !(typeof file === 'string')) {
    throw new Error('Error parsing settings file from URL.')
  }

  const settingsObject = ctx.vtex.settings ? ctx.vtex.settings[0] : null
  if (!settingsObject) {
    throw new Error(`Error getting settings from context when asking for file ${file}.`)
  }
  const settingsDeclarer = removeVersionFromAppId(settingsObject.declarer)
  const allSettingsFromDeclarer = settingsObject[settingsDeclarer]
  const settingFile = allSettingsFromDeclarer[file]
  if (!settingFile) {
    throw new Error(`Error getting setting ${file} from context.`)
  }

  const cacheType = LINKED ? 'no-cache' : 'public, max-age=60'
  ctx.set('cache-control', cacheType)
  ctx.status = 200
  ctx.body = settingFile

  await next()
}
