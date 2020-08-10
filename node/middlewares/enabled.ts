export async function enabledService(ctx: Context, next: () => Promise<any>) {

  ctx.set('cache-control', 'no-cache, no-store') // Cache info for 10 min
  // ctx.set('cache-control', 'public, max-age=600') // Cache info for 10 min
  ctx.status = 204
  ctx.body = 'Checkout-ui settings app installed in account and workspace.'
  console.log('Enabled')
  await next()
}
