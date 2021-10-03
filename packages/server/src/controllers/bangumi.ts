import { Request, Response } from 'express'
import bangumiModel from '../models/bangumi'
import { SiteType } from 'bangumi-list-v2-shared/src/types/Bangumi.interface'

export async function update (req: Request, res: Response): Promise<void> {
  try {
    await bangumiModel.update()
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
    return
  }
  res.sendStatus(201)
}

export async function test (req: Request, res: Response): Promise<void> {
  const data = bangumiModel.data
  if (data) {
    res.send(data)
    return
  }
  res.sendStatus(404)
}

export async function season (req: Request, res: Response): Promise<void> {
  const version = bangumiModel.version
  let items = [...bangumiModel.seasons]
  const { start } = req.query
  const startIndex = items.findIndex(item => item === start)
  if (startIndex !== -1) {
    items = items.slice(startIndex)
  }

  res.send({
    version,
    items
  })
}

export async function site (req: Request, res: Response): Promise<void> {
  const { type } = req.query
  let result = {}
  if (type) {
    result = {...bangumiModel.siteMap[type as SiteType]}
  } else {
    result = {...bangumiModel.data?.siteMeta}
  }
  res.send(result)
}

export async function seasonItem (req: Request, res: Response): Promise<void> {
  const { season } = req.params
  res.send({
    items: [
      ...bangumiModel.seasonMap[season]
    ]
  })
}
