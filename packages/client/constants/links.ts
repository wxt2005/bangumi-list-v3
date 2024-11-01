import { BangumiDomain } from 'bangumi-list-v3-shared';

export const SUBMIT_PROBLEM_LINK = encodeURI(
  'mailto:wise.home5941@fastmail.com?subject=番组放送-错误提交'
);

export const bangumiTemplates = {
  [BangumiDomain.BANGUMI_TV]: 'https://bangumi.tv/subject/{{id}}',
  [BangumiDomain.BGM_TV]: 'https://bgm.tv/subject/{{id}}',
  [BangumiDomain.CHII_IN]: 'https://chii.in/subject/{{id}}',
};
