import React from 'react';
import classNames from 'classnames';
import styles from './Container.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function BaseContainer(props: Props): JSX.Element {
  const rootClassName = classNames(props.className, styles.root);

  return <div className={rootClassName}>{props.children}</div>;
}
