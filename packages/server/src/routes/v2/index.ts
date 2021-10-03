import express from 'express'
import bangumiRouter from './bangumi'

const router = express.Router()

router.use('/bangumi', bangumiRouter)

export default router
