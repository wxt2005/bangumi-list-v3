import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <meta name="renderer" content="webkit" />
        <meta
          name="description"
          content="番组放送: 方便快捷的版权动画播放地址聚合站"
        />
        <meta
          name="keywords"
          content="番组放送, 新番, 动画, 动漫, 正版, 版权"
        />
        <meta name="author" content="@wxt2005" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1abc9c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <div id="modal"></div>
        <NextScript />
      </body>
    </Html>
  );
}
