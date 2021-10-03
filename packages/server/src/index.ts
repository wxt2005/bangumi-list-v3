import express from 'express'
import routerV2 from './routes/v2'
import bangumiModel from './models/bangumi'

(async function main () {
  const port = process.env.PORT || 3000
  const app = express()

  await bangumiModel.update()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/v2', routerV2)
  app.listen(port)
  console.log('Listening on port ' + port)
}())
