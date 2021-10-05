import React from 'react';
import { BangumiSite } from 'bangumi-list-v3-shared';
import { useAppSelector } from '../app/hooks';
import { selectSiteEntities } from '../features/bangumi/siteSlice';
import { selectCommonPreference } from '../features/preference/commonPreferenceSlice';
import { bangumiTemplates } from '../constants/links';

interface Props {
  newTab?: boolean;
  site: BangumiSite;
}

export default function BangumiLinkItem(props: Props): JSX.Element {
  const { newTab = true, site } = props;
  const sites = useAppSelector(selectSiteEntities);
  const commonPreference = useAppSelector(selectCommonPreference);
  const title = sites[site.site].title;
  let urlTemplate = sites[site.site].urlTemplate;
  if (site.site === 'bangumi') {
    urlTemplate = bangumiTemplates[commonPreference.bangumiDomain];
  }
  const href = urlTemplate.replace(/\{\{id\}\}/g, site.id);
  const target = newTab ? '_blank' : '_self';

  return (
    <a href={href} rel="noopener" target={target}>
      {title}
    </a>
  );
}
