import { stat } from 'fs/promises'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import { Data, Item, SiteItem, SiteType } from 'bangumi-list-v2-shared/src/types/Bangumi.interface'
import moment from 'moment'
import axios, { AxiosResponse } from 'axios'
import { Stream } from 'stream'

export interface SiteMap {
  [SiteType.INFO]?: {
    [key: string]: SiteItem
  },
  [SiteType.ONAIR]?: {
    [key: string]: SiteItem
  },
  [SiteType.RESOURCE]?: {
    [key: string]: SiteItem
  }
}

export interface SeasonMap {
  [key: string]: Item[]
}

class BangumiModel {
  public seasons: string[] = []
  public seasonMap: SeasonMap = {}
  public siteMap: SiteMap = {}
  public data?: Data
  public version = 0

  private dataPath: string
  private dataFolderPath: string
  private dataURL = 'https://raw.githubusercontent.com/bangumi-data/bangumi-data/master/dist/data.json'

  constructor () {
    this.dataFolderPath = path.resolve(process.cwd(), '.run/data')
    this.dataPath = path.resolve(this.dataFolderPath, 'data.json')
  }

  get isLoaded (): boolean {
    return !!this.version
  }

  public async update () {
    const newDataPath = this.dataPath + `.${Date.now()}`
    await fse.ensureDir(this.dataFolderPath)
    const resp: AxiosResponse<Stream> = await axios({
      url: this.dataURL,
      method: 'GET',
      responseType: 'stream'
    })
    await new Promise((resolve) => {
      resp.data.on('end', async () => {
        await fse.rename(newDataPath, this.dataPath)
        resolve(undefined)
      })
      resp.data.pipe(fs.createWriteStream(newDataPath))
    })
    await this.read()
    this.process()
  }

  private async read () {
    const statRes = await stat(this.dataPath)
    const newData = await fse.readJSON(this.dataPath)
    this.version = Math.floor(statRes.mtimeMs)
    this.data = { version: this.version, ...newData }
  }

  private process () {
    if (!this.data) return
    const { items, siteMeta } = this.data

    // Seasons
    const seasons: Set<string> = new Set()
    const seasonMap: SeasonMap = {}
    for (const item of items) {
      const { begin } = item
      const beginDate = moment(begin)
      const season = beginDate.format('YYYY[q]Q')
      seasons.add(season)
      if (!seasonMap[season]) {
        seasonMap[season] = []
      }
      seasonMap[season].push(item)
    }
    this.seasons = Array.from<string>(seasons)
    this.seasonMap = seasonMap

    // Sites
    const siteMap: SiteMap = {}
    for (const [siteName, site] of Object.entries(siteMeta)) {
      const { type } = site
      if (!siteMap[type]) {
        siteMap[type] = {}
      }
      (siteMap[type] || {})[siteName] = site
    }
    this.siteMap = siteMap
  }
}

export default new BangumiModel()
