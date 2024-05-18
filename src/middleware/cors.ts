import { cors as honoCors } from 'hono/cors'

export const cors = () =>
  honoCors({
    origin: (origin) => (origin.endsWith('.tarikyildizci.com') ? origin : ''),
    credentials: true,
    allowMethods: ['*'],
    exposeHeaders: ['Content-Type'],
    allowHeaders: ['Content-Type'],
  })
