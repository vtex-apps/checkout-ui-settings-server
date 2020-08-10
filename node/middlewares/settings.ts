import { removeVersionFromAppId } from '@vtex/api'

import { LINKED } from '../constants'

function parseFileFromURL(url: string) {
  const maybeFileWithQuery = url.split('/')[2]
  const maybeFile = maybeFileWithQuery.split('?')[0]
  return maybeFile
}

const DATA_ENTITY = 'checkoutcustom'

export async function getSettingsFromContext(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterdata, hub },
    request: { url },
    vtex: { workspace },
  } = ctx

  console.log('>>>> getSettingsFromContext <<<<', workspace)
  const file = parseFileFromURL(url)

  if (!file || !(typeof file === 'string')) {
    throw new Error('Error parsing settings file from URL.')
  }

  const schemas = await hub.getSchemas().then((res: any) => res.data)

  console.log('Schemas =>', schemas)

  let mdFiles:any = []
  let settingFile = null
  if (schemas && schemas.length) {
    mdFiles = await masterdata.searchDocuments({
      dataEntity: DATA_ENTITY,
      fields: ['id', 'email', 'workspace', 'creationDate', 'appVersion'],
      sort: 'creationDate DESC',
      schema: schemas[0].name,
      where: `workspace=${workspace}`,
      pagination: {
        page: 1,
        pageSize: 1,
      },
    })
    if (mdFiles.length) {
      settingFile = mdFiles[0][file]
    }

    console.log('Data =>', mdFiles)
  }

  if (mdFiles.length === 0) {
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

  // const cacheType = LINKED ? 'no-cache' : 'public, max-age=60'
  console.log('LINKED', LINKED)
  console.log('File', file)
  const cacheType = 'no-cache, no-store'
  const fileType = file.split('.').pop() === 'css' ? 'text/css' : 'text/javascript'
  ctx.set('cache-control', cacheType)
  ctx.set('content-type', fileType)
  ctx.status = 200
  ctx.body = settingFile

  await next()
}
