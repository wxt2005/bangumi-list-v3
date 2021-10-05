export enum BangumiDomain {
  BANGUMI_TV = 'bangumi.tv',
  BGM_TV = 'bgm.tv',
  CHII_IN = 'chii.in',
}

export interface CommonPreference {
  newOnly: boolean;
  watchingOnly: boolean;
  hoistWatching: boolean;
  bangumiDomain: BangumiDomain;
}

export interface VersionedCommonPreference extends CommonPreference {
  version: number;
}

export interface BangumiPreference {
  watching: string[];
}

export interface VersionedBangumiPreference extends BangumiPreference {
  version: number;
}
