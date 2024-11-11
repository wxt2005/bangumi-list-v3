export enum BangumiDomain {
  BANGUMI_TV = 'bangumi.tv',
  BGM_TV = 'bgm.tv',
  CHII_IN = 'chii.in',
}

export enum MikanDomain {
  MIKANANI_ME = 'mikanani.me',
  MIKANIME_TV = 'mikanime.tv',
}

export interface CommonPreference {
  newOnly: boolean;
  watchingOnly: boolean;
  hoistWatching: boolean;
  bangumiDomain: BangumiDomain;
  mikanDomain: MikanDomain;
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
