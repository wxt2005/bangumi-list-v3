/// <reference types="react" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
