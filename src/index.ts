import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { log, cors } from './middleware'

const app = new Hono({})

app.use(log(), cors())

app.use('/hello')

app.get('/hello', (c) => {
  return c.json({ hello: 'world' })
})

app.post('/hello', async (c) => {
  const body = await c.req.json()
  return c.json({ body })
})

app.notFound((c) => {
  return c.text('404 Not Found', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text(`Internal server error: ${err.message}`, 500)
})

const port = +(process.env.PORT || 1247)
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
