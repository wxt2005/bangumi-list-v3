import express, { Request, Response } from 'express'
import * as bangumiController from '../../controllers/bangumi'

const router = express.Router()

router.post('/update', async (req: Request, res: Response) => {
  await bangumiController.update(req, res)
})

router.get('/test', async (req: Request, res: Response) => {
  await bangumiController.test(req, res)
})

router.get('/season', async (req: Request, res: Response) => {
  await bangumiController.season(req, res)
})

router.get('/season/:season', async (req: Request, res: Response) => {
  await bangumiController.seasonItem(req, res)
})

router.get('/site', async (req: Request, res: Response) => {
  await bangumiController.site(req, res)
})

export default router
