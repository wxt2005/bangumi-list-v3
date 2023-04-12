import React from 'react';
import type { BangumiSite, SiteMeta } from 'bangumi-list-v3-shared';

interface Props {
  newTab?: boolean;
  site: BangumiSite;
  siteMeta?: SiteMeta;
}

export default function BangumiLinkItem(props: Props): JSX.Element {
  const { newTab = true, site, siteMeta = {} } = props;
  const title = siteMeta[site.site]?.title ?? '未知';
  const urlTemplate = siteMeta[site.site]?.urlTemplate ?? '';
  const href = urlTemplate.replace(/\{\{id\}\}/g, site.id);
  const target = newTab ? '_blank' : '_self';

  return (
    <a href={href} rel="noopener" target={target}>
      {title}
    </a>
  );
}
