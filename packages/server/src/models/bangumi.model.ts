import { stat } from 'fs/promises';
import fs, { constants } from 'fs';
import fse from 'fs-extra';
import path from 'path';
import {
  BangumiSite,
  Data,
  Item,
  SiteItem,
  SiteType,
} from 'bangumi-list-v3-shared';
import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import { Stream } from 'stream';
import md5 from 'md5';
import { DATA_DIR, DATA_FILE } from '../config';
import { flatten } from 'lodash';
import pinyin from 'pinyin';

export interface SiteMap {
  [SiteType.INFO]?: {
    [key: string]: SiteItem;
  };
  [SiteType.ONAIR]?: {
    [key: string]: SiteItem;
  };
  [SiteType.RESOURCE]?: {
    [key: string]: SiteItem;
  };
}

class BangumiModel {
  public seasons: string[] = [];
  public seasonIds: { [key: string]: string[] } = {};
  public onairIds: string[] = [];
  public itemEntities: { [key: string]: Item } = {};
  public siteMap: SiteMap = {};
  public data?: Data;
  public version = 0;

  private dataPath: string;
  private dataFolderPath: string;
  private dataURL =
    'https://raw.githubusercontent.com/bangumi-data/bangumi-data/master/dist/data.json';

  constructor() {
    this.dataFolderPath = DATA_DIR;
    this.dataPath = path.resolve(DATA_DIR, DATA_FILE);
  }

  get isLoaded(): boolean {
    return !!this.version;
  }

  public async update(force = true) {
    const newDataPath = this.dataPath + `.${Date.now()}`;
    let skip = false;
    await fse.ensureDir(this.dataFolderPath);
    if (!force) {
      try {
        await fse.access(this.dataPath, constants.R_OK);
        skip = true;
      } catch (e) {
        // ignore
      }
    }

    if (!skip) {
      const resp: AxiosResponse<Stream> = await axios({
        url: this.dataURL,
        method: 'GET',
        responseType: 'stream',
      });
      await new Promise((resolve) => {
        resp.data.on('end', async () => {
          await fse.rename(newDataPath, this.dataPath);
          resolve(undefined);
        });
        resp.data.pipe(fs.createWriteStream(newDataPath));
      });
    }

    await this.read();
    this.process();
  }

  private async read() {
    const statRes = await stat(this.dataPath);
    const newData = await fse.readJSON(this.dataPath);
    this.version = Math.floor(statRes.mtimeMs);
    this.data = { version: this.version, ...newData };
  }

  private process() {
    if (!this.data) return;
    const now = moment();
    const { items, siteMeta } = this.data;

    const seasons: Set<string> = new Set();
    const seasonIds: { [key: string]: string[] } = {};
    const onairIds: string[] = [];
    const itemEntities: { [key: string]: Item } = {};
    for (const item of items) {
      const { begin, end } = item;
      const beginDate = moment(begin);
      const endDate = end ? moment(end) : null;
      const season = beginDate.format('YYYY[q]Q');
      seasons.add(season);
      if (!seasonIds[season]) {
        seasonIds[season] = [];
      }
      const id = generateItemID(item);
      item.id = generateItemID(item);
      if (beginDate.isBefore(now) && (!endDate || endDate.isAfter(now))) {
        onairIds.push(id);
      }
      seasonIds[season].push(id);
      item.sites.sort(siteSortCompare);
      generatePinyinTitltes(item);
      itemEntities[id] = item;
    }
    this.seasons = Array.from<string>(seasons);
    this.seasonIds = seasonIds;
    this.onairIds = onairIds;
    this.itemEntities = itemEntities;

    // Sites
    const siteMap: SiteMap = {};
    for (const [siteName, site] of Object.entries(siteMeta)) {
      const { type } = site;
      if (!siteMap[type]) {
        siteMap[type] = {};
      }
      (siteMap[type] || {})[siteName] = site;
    }
    this.siteMap = siteMap;
  }
}

function generateItemID(item: Item): string {
  const { title, begin } = item;
  const beginDate = moment(begin);
  const idString = `${beginDate.format('YYYY-MM')}${title}`;
  return md5(idString);
}

function siteSortCompare(first: BangumiSite, second: BangumiSite): number {
  return first.site < second.site ? -1 : 1;
}

function generatePinyinTitltes(item: Item) {
  if (!item.titleTranslate || !item.titleTranslate['zh-Hans']) return;
  const pinyinTitles = [];
  for (const title of item.titleTranslate['zh-Hans']) {
    pinyinTitles.push(
      flatten(
        pinyin(title, {
          style: pinyin.STYLE_NORMAL,
        })
      ).join(''),
      flatten(
        pinyin(title, {
          style: pinyin.STYLE_FIRST_LETTER,
        })
      ).join('')
    );
  }
  item.pinyinTitles = pinyinTitles;
}

export default new BangumiModel();
