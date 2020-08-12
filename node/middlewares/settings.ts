import { removeVersionFromAppId } from '@vtex/api'

import { LINKED } from '../constants'

function parseFileFromURL(url: string) {
  const maybeFileWithQuery = url.split('/')[2]
  const maybeFile = maybeFileWithQuery.split('?')[0]
  return maybeFile
}

const DATA_ENTITY = 'checkoutcustom'
const CACHE = 60

export async function getSettingsFromContext(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterdata, hub },
    request: { url },
    vtex: { workspace },
  } = ctx

  const file = parseFileFromURL(url)

  if (!file || !(typeof file === 'string')) {
    throw new Error('Error parsing settings file from URL.')
  }
  const fileType = file.split('.').pop() === 'css' ? 'text/css' : 'text/javascript'

  let mdFiles: any = []
  let settingFile = null

  try {
    const schemas = await hub.getSchemas().then((res: any) => res.data)
    const field = fileType === 'text/css' ? 'cssBuild' : 'javascriptBuild'
    if (schemas && schemas.length) {
      mdFiles = await masterdata.searchDocuments({
        dataEntity: DATA_ENTITY,
        fields: [field],
        sort: 'creationDate DESC',
        schema: schemas.sort(function (a: any, b: any) {
          return a.name > b.name ? -1 : 1
        })[0].name,
        where: `workspace=${workspace}`,
        pagination: {
          page: 1,
          pageSize: 1,
        },
      })
      if (mdFiles && mdFiles.length) {
        settingFile = mdFiles[0][field]
      }
    }
  } catch (e) {
    throw new Error(`Error getting ${file} from MD.`)
  }

  if (!mdFiles || mdFiles.length === 0) {
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
  }

  const cacheType = LINKED ? 'no-cache' : 'public, max-age=' + (workspace !== 'master' ? 10 : CACHE)

  ctx.set('cache-control', cacheType)
  ctx.set('content-type', fileType)
  ctx.status = 200
  ctx.body = settingFile

  await next()
}
