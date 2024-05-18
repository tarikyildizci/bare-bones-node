// This is an example middleware

import { MiddlewareHandler } from 'hono'
import { appendFile, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

type LogType = () => MiddlewareHandler

export const log: LogType = () => async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${c.req.method} ${c.req.url} - ${ms}ms`)

  const logFileDir = process.cwd() + '/logs'

  const logToFile = (message: string) => {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const logFileName = `${year}-${month}-${day}.log`
    const logFilePath = join(logFileDir, logFileName)
    const logMessage = `${year}-${month}-${day} ${hour}:${minute}:${second} ${message}\n`

    if (!existsSync(logFileDir)) {
      mkdirSync(logFileDir)
    }
    appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  logToFile(`${c.req.method} ${c.req.url} - ${ms}ms`)
}
