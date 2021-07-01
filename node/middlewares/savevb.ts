import { json } from 'co-body'

import { Readable } from 'stream'
export async function saveVB(ctx: Context) {
  const {
    clients: { vbase },
    req,
  } = ctx

  const body = await json(req)

  const { workspace, field, file } = body

  const stream = new Readable()
  stream._read = () => undefined
  stream.push(file)
  stream.push(null)

  await vbase
    .saveFile('checkoutuicustom', `${workspace}-${field}`, stream)

    ctx.set('cache-control', 'no-cache')
    ctx.status = 200
    ctx.body = 'OK'
}
